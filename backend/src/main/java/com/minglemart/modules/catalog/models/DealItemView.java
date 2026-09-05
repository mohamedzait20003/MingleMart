package com.minglemart.modules.catalog.models;

import lombok.*;
import java.util.UUID;
import java.time.Instant;
import java.math.BigDecimal;
import jakarta.persistence.*;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.minglemart.shared.common.Money;
import com.minglemart.shared.enums.DealKind;

@Entity
@Immutable
@Table(name = "active_deal_items")
@Getter
@NoArgsConstructor
public class DealItemView {

    @Id
    @Column(name = "variant_id")
    private UUID variantId;

    // --- the campaign ---

    @Column(name = "deal_id")
    private UUID dealId;

    @Column(name = "deal_slug", length = 160)
    private String dealSlug;

    @Column(name = "deal_title")
    private String dealTitle;

    @Enumerated(EnumType.STRING)
    @Column(name = "deal_kind", length = 16)
    private DealKind dealKind;

    @Column(name = "badge_text", length = 32)
    private String badgeText;

    private int priority;

    @Column(name = "is_featured")
    private boolean featured;

    /** The countdown target: the offer's own end, or the campaign's. */
    @Column(name = "ends_at")
    private Instant endsAt;

    // --- what is on sale ---

    @Column(name = "product_id")
    private UUID productId;

    @Column(name = "product_slug", length = 200)
    private String productSlug;

    @Column(name = "product_name")
    private String productName;

    private String brand;

    @Column(name = "category_id")
    private UUID categoryId;

    @Column(length = 64)
    private String sku;

    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(length = 3)
    private String currency;

    // --- the price ---

    @Column(name = "list_price_amount")
    private BigDecimal listPriceAmount;

    @Column(name = "effective_price_amount")
    private BigDecimal effectivePriceAmount;

    @Column(name = "savings_amount")
    private BigDecimal savingsAmount;

    /** Rounded for display; the money columns stay exact. */
    @Column(name = "percent_off")
    private BigDecimal percentOff;

    // --- scarcity ---

    @Column(name = "offer_id")
    private UUID offerId;

    @Column(name = "redemption_limit")
    private Integer redemptionLimit;

    @Column(name = "redeemed_count")
    private Integer redeemedCount;

    /** Null when the offer is unlimited: there is no "4 left" to show. */
    @Column(name = "units_left")
    private Integer unitsLeft;

    public Money listPrice() {
        return new Money(listPriceAmount, currency);
    }

    public Money effectivePrice() {
        return new Money(effectivePriceAmount, currency);
    }

    public Money savings() {
        return new Money(savingsAmount, currency);
    }

    /** Share of the allocation already taken, 0-100, for the "% claimed" bar. */
    public int percentClaimed() {
        if (redemptionLimit == null || redemptionLimit == 0 || redeemedCount == null) {
            return 0;
        }
        return Math.min(100, redeemedCount * 100 / redemptionLimit);
    }
}
