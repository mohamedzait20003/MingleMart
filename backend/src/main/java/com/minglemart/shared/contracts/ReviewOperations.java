package com.minglemart.shared.contracts;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.minglemart.shared.common.ActorRef;

/**
 * Writing and reading product reviews, as the rest of the application sees it.
 *
 * <p>Catalog owns the reviews because a rating is a fact about a product. Other
 * modules reach them through this interface rather than through the entities,
 * so nothing outside catalog needs to know that the score is derived rather
 * than stored.
 */
public interface ReviewOperations {

    /**
     * Records {@code userId}'s opinion of a product, replacing their previous
     * one if they had already reviewed it.
     *
     * <p>Upsert rather than insert because a person has exactly one opinion of a
     * product at a time — the database enforces that, and failing a resubmission
     * would leave a shopper unable to correct their own review.
     */
    Review submit(UUID productId, UUID userId, Draft draft, ActorRef actor);

    /** Removes a review. Scoped by user: nobody withdraws someone else's. */
    void withdraw(UUID reviewId, UUID userId, ActorRef actor);

    Optional<Review> findMine(UUID productId, UUID userId);

    /** Published reviews for a product, newest first. */
    List<Review> forProduct(UUID productId, int limit);

    /** Empty when nobody has reviewed the product — unrated, not rated zero. */
    Optional<Rating> ratingOf(UUID productId);

    record Draft(int rating, String title, String body) {
    }

    record Review(
            UUID id,
            UUID productId,
            UUID userId,
            int rating,
            String title,
            String body,
            boolean verifiedPurchase,
            int helpfulCount,
            Instant createdAt) {
    }

    record Rating(UUID productId, BigDecimal average, long count) {
    }
}
