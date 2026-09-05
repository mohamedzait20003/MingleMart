package com.minglemart.modules.catalog.models;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;

import org.hibernate.annotations.Immutable;

/**
 * What a product is rated, and by how many people. Backed by the
 * {@code product_ratings} view, which counts PUBLISHED reviews only.
 *
 * <p>A product with no reviews has no row here at all, so a caller that finds
 * nothing is looking at something unrated rather than something rated zero.
 */
@Entity
@Immutable
@Table(name = "product_ratings")
@Getter
@NoArgsConstructor
public class ProductRatingView {

    @Id
    @Column(name = "product_id")
    private UUID productId;

    @Column(name = "review_count")
    private long reviewCount;

    /** One decimal place, as displayed: 4.8. */
    @Column(name = "average_rating", precision = 2, scale = 1)
    private BigDecimal averageRating;

    // --- histogram, for the breakdown on a product page ---

    @Column(name = "five_star")
    private int fiveStar;

    @Column(name = "four_star")
    private int fourStar;

    @Column(name = "three_star")
    private int threeStar;

    @Column(name = "two_star")
    private int twoStar;

    @Column(name = "one_star")
    private int oneStar;

    @Column(name = "verified_count")
    private int verifiedCount;

    /** Share of reviews at {@code stars}, 0-100, for a histogram bar. */
    public int percentAt(int stars) {
        if (reviewCount == 0) {
            return 0;
        }

        int count = switch (stars) {
            case 5 -> fiveStar;
            case 4 -> fourStar;
            case 3 -> threeStar;
            case 2 -> twoStar;
            case 1 -> oneStar;
            default -> 0;
        };

        return (int) Math.round(count * 100.0 / reviewCount);
    }
}
