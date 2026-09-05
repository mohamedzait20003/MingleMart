package com.minglemart.modules.catalog.models;

import lombok.*;
import java.util.List;
import java.time.Instant;
import java.util.ArrayList;
import jakarta.persistence.*;
import lombok.experimental.SuperBuilder;

import com.minglemart.shared.enums.DealKind;
import com.minglemart.shared.domain.BaseModel;
import com.minglemart.shared.enums.DealStatus;

@Entity
@Table(name = "deals")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class DealModel extends BaseModel {

    @Column(nullable = false, unique = true, length = 160)
    private String slug;

    @Column(nullable = false)
    private String title;

    /** One-line hook for the hero: "Today only, until midnight". */
    private String headline;

    private String description;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private DealKind kind = DealKind.CAMPAIGN;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private DealStatus status = DealStatus.DRAFT;

    @Column(length = 32)
    private String badgeText;

    private String bannerImageUrl;

    /** Null on either end means unbounded in that direction. */
    private Instant startsAt;

    private Instant endsAt;

    /** Ordering on the deals page; the hero takes the highest live one. */
    @Builder.Default
    @Column(nullable = false)
    private int priority = 0;

    @Builder.Default
    @Column(name = "is_featured", nullable = false)
    private boolean featured = false;

    @OneToMany(mappedBy = "deal", fetch = FetchType.LAZY,
               cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OfferModel> offers = new ArrayList<>();

    /**
     * Whether the campaign is running at {@code now}. Mirrors the predicate in
     * the {@code active_offers} view; the view remains the authority for
     * pricing, this is here so callers can explain a deal without a round trip.
     */
    public boolean isLive(Instant now) {
        return status == DealStatus.ACTIVE
                && (startsAt == null || !startsAt.isAfter(now))
                && (endsAt == null || endsAt.isAfter(now));
    }

    public void addOffer(OfferModel offer) {
        offers.add(offer);
        offer.setDeal(this);
    }
}
