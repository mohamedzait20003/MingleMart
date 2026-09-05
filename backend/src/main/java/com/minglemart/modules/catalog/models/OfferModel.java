package com.minglemart.modules.catalog.models;

import lombok.*;
import java.util.Set;
import java.util.List;
import java.time.Instant;
import java.util.ArrayList;
import java.math.BigDecimal;
import jakarta.persistence.*;
import java.util.LinkedHashSet;
import lombok.experimental.SuperBuilder;
import org.hibernate.type.SqlTypes;
import org.hibernate.annotations.JdbcTypeCode;

import com.minglemart.shared.domain.BaseModel;
import com.minglemart.shared.enums.DealStatus;
import com.minglemart.shared.enums.DiscountType;

@Entity
@Table(name = "offers")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class OfferModel extends BaseModel {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deal_id")
    private DealModel deal;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, length = 16)
    private DiscountType discountType;

    @Column(precision = 5, scale = 2)
    private BigDecimal percentOff;

    @Column(precision = 19, scale = 4)
    private BigDecimal amountOff;

    @Column(precision = 19, scale = 4)
    private BigDecimal fixedPriceAmount;

    /** Ceiling on a percentage cut: "25% off, up to $50". */
    @Column(precision = 19, scale = 4)
    private BigDecimal maxDiscountAmount;

    @Builder.Default
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(nullable = false, length = 3)
    private String currency = "USD";

    /**
     * Units that must be bought before the offer bites. 1 — the default — is
     * the only value that can be shown as a shelf price.
     */
    @Builder.Default
    @Column(nullable = false)
    private int minQuantity = 1;

    /** The "buy X" half of a buy-X-get-Y rule. */
    private Integer buyQuantity;

    /** The {@code get_quantity} column: how many units the reward covers. */
    @Column(name = "get_quantity")
    private Integer rewardQuantity;

    /** The {@code get_percent_off} column; 100 means the reward units are free. */
    @Column(name = "get_percent_off", precision = 5, scale = 2)
    private BigDecimal rewardPercentOff;

    /** Breaks a tie when two offers land on the same variant at the same price. */
    @Builder.Default
    @Column(nullable = false)
    private int priority = 0;


    @Builder.Default
    @Column(name = "is_stackable", nullable = false)
    private boolean stackable = false;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    /** Null inherits the parent deal's window. */
    private Instant startsAt;

    private Instant endsAt;

    /** Null means unlimited. Otherwise the scarcity behind "only 4 left". */
    private Integer redemptionLimit;

    @Builder.Default
    @Column(nullable = false)
    private int redeemedCount = 0;

    @OneToMany(mappedBy = "offer", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC")
    @Builder.Default
    private List<OfferTargetModel> targets = new ArrayList<>();

    @OneToMany(mappedBy = "offer", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<OfferBundleItemModel> bundleItems = new LinkedHashSet<>();

    // --- allocation ---

    /** Null when the offer is unlimited: there is no "4 left" to show. */
    public Integer unitsLeft() {
        return redemptionLimit == null ? null : Math.max(redemptionLimit - redeemedCount, 0);
    }

    public boolean isExhausted() {
        return redemptionLimit != null && redeemedCount >= redemptionLimit;
    }

    /** Share of the allocation already taken, 0-100, for the "% claimed" bar. */
    public int percentClaimed() {
        if (redemptionLimit == null || redemptionLimit == 0) {
            return 0;
        }
        return Math.min(100, redeemedCount * 100 / redemptionLimit);
    }

    // --- window ---

    public boolean isLive(Instant now) {
        if (!active || isExhausted()) {
            return false;
        }
        if (deal != null && deal.getStatus() != DealStatus.ACTIVE) {
            return false;
        }

        Instant from = startsAt;
        Instant until = endsAt;

        if (deal != null) {
            if (from == null) {
                from = deal.getStartsAt();
            }
            if (until == null) {
                until = deal.getEndsAt();
            }
        }

        return (from == null || !from.isAfter(now)) && (until == null || until.isAfter(now));
    }

    /** Whether this offer can be resolved for one unit, and so reach the shelf. */
    public boolean isShelfPriced() {
        return discountType != null && discountType.isPerUnit() && minQuantity == 1;
    }

    public void addTarget(OfferTargetModel target) {
        targets.add(target);
        target.setOffer(this);
    }

    public void addBundleItem(ProductVariantModel variant, int quantity) {
        bundleItems.add(OfferBundleItemModel.of(this, variant, quantity));
    }
}
