package com.minglemart.modules.catalog.models;

import lombok.*;
import java.util.UUID;
import java.io.Serializable;
import jakarta.persistence.*;


@Entity
@Table(name = "offer_bundle_items")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OfferBundleItemModel {
    @EmbeddedId
    @Builder.Default
    private Id id = new Id();

    @MapsId("offerId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "offer_id", nullable = false)
    private OfferModel offer;

    @MapsId("variantId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariantModel variant;

    @Builder.Default
    @Column(nullable = false)
    private int quantity = 1;

    public static OfferBundleItemModel of(OfferModel offer, ProductVariantModel variant, int quantity) {
        return OfferBundleItemModel.builder()
                .id(new Id(offer.getId(), variant.getId()))
                .offer(offer)
                .variant(variant)
                .quantity(quantity)
                .build();
    }

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class Id implements Serializable {

        @Column(name = "offer_id")
        private UUID offerId;

        @Column(name = "variant_id")
        private UUID variantId;
    }
}
