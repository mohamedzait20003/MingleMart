package com.minglemart.modules.catalog.models;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.hibernate.annotations.Generated;
import org.hibernate.generator.EventType;

import com.minglemart.shared.enums.OfferScope;

/**
 * What an offer applies to, as a scope rather than a list — so filing a new
 * product under a discounted category puts it on sale without anyone touching
 * the offer.
 *
 * <p>Exactly one pointer is set for each scope, which {@code ck_offer_targets_scope}
 * enforces. Build these through the static factories rather than the builder:
 * they are the only way to get the scope and its pointer in step.
 *
 * <p>Does not extend {@code BaseModel}: {@code offer_targets} records
 * {@code created_at} but no {@code updated_at}.
 */
@Entity
@Table(name = "offer_targets")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OfferTargetModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "offer_id", nullable = false)
    private OfferModel offer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private OfferScope scope;

    /** Matches the whole subtree beneath it, not just direct children. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private CategoryModel category;

    private String brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private ProductModel product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    private ProductVariantModel variant;

    /** Exclusions are subtracted from the rows the inclusions matched. */
    @Builder.Default
    @Column(name = "is_exclusion", nullable = false)
    private boolean exclusion = false;

    /** Hand-curated ordering, for when a merchandiser picks the products. */
    @Builder.Default
    @Column(nullable = false)
    private int position = 0;

    @Generated(event = EventType.INSERT)
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    // --- factories: the scope and its pointer can only agree ---

    /** Everything in the catalogue. */
    public static OfferTargetModel all(boolean exclusion) {
        return OfferTargetModel.builder().scope(OfferScope.ALL).exclusion(exclusion).build();
    }

    public static OfferTargetModel category(CategoryModel category, boolean exclusion) {
        return OfferTargetModel.builder()
                .scope(OfferScope.CATEGORY).category(category).exclusion(exclusion).build();
    }

    public static OfferTargetModel brand(String brand, boolean exclusion) {
        return OfferTargetModel.builder()
                .scope(OfferScope.BRAND).brand(brand).exclusion(exclusion).build();
    }

    public static OfferTargetModel product(ProductModel product, boolean exclusion) {
        return OfferTargetModel.builder()
                .scope(OfferScope.PRODUCT).product(product).exclusion(exclusion).build();
    }

    public static OfferTargetModel variant(ProductVariantModel variant, boolean exclusion) {
        return OfferTargetModel.builder()
                .scope(OfferScope.VARIANT).variant(variant).exclusion(exclusion).build();
    }
}
