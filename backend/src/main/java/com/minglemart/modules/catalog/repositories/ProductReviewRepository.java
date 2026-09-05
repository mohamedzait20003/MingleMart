package com.minglemart.modules.catalog.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.minglemart.modules.catalog.models.ProductReviewModel;
import com.minglemart.shared.domain.BaseRepository;
import com.minglemart.shared.enums.ReviewStatus;

public interface ProductReviewRepository extends BaseRepository<ProductReviewModel> {

    /** The one review a person is allowed to have on a product, if they wrote it. */
    Optional<ProductReviewModel> findByProductIdAndUserId(UUID productId, UUID userId);

    boolean existsByProductIdAndUserId(UUID productId, UUID userId);

    List<ProductReviewModel> findByProductIdAndStatusOrderByCreatedAtDesc(
            UUID productId, ReviewStatus status, Pageable pageable);

    List<ProductReviewModel> findByUserIdOrderByCreatedAtDesc(UUID userId);

    long countByProductIdAndStatus(UUID productId, ReviewStatus status);

    /**
     * Bumps the "was this helpful" tally without loading the row. A read-modify
     * -write would lose votes cast at the same moment; this cannot.
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("UPDATE ProductReviewModel r SET r.helpfulCount = r.helpfulCount + 1 WHERE r.id = :reviewId")
    int markHelpful(@Param("reviewId") UUID reviewId);
}
