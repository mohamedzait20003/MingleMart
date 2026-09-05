package com.minglemart.modules.catalog.models;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.minglemart.shared.domain.BaseModel;
import com.minglemart.shared.enums.ReviewStatus;

/**
 * One shopper's opinion of a product.
 *
 * <p>Attached to the product rather than the variant: a rating is about "the
 * blue running shoe", not about size 42 of it.
 *
 * <p>{@code userId} is a plain column, not a {@code @ManyToOne} to identity —
 * catalog holds no compile-time reference to another module's entity. The
 * database still carries the foreign key.
 */
@Entity
@Table(name = "product_reviews")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ProductReviewModel extends BaseModel {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private ProductModel product;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    /** 1 to 5, enforced by a CHECK constraint. */
    @JdbcTypeCode(SqlTypes.SMALLINT)
    @Column(nullable = false)
    private int rating;

    private String title;

    private String body;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private ReviewStatus status = ReviewStatus.PUBLISHED;

    /** False means "not established", never "did not buy it". */
    @Builder.Default
    @Column(name = "is_verified_purchase", nullable = false)
    private boolean verifiedPurchase = false;

    @Builder.Default
    @Column(nullable = false)
    private int helpfulCount = 0;

    public boolean isPublished() {
        return status == ReviewStatus.PUBLISHED;
    }
}
