package com.minglemart.modules.catalog.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minglemart.modules.catalog.models.ProductRatingView;
import com.minglemart.modules.catalog.models.ProductReviewModel;
import com.minglemart.modules.catalog.repositories.ProductRatingRepository;
import com.minglemart.modules.catalog.repositories.ProductReviewRepository;
import com.minglemart.shared.common.ActorRef;
import com.minglemart.shared.domain.BaseDataService;
import com.minglemart.shared.enums.ReviewStatus;

/**
 * Product reviews, and the ratings derived from them.
 *
 * <p>Implements {@link com.minglemart.shared.contracts.ReviewOperations} so the
 * rest of the application can post a review without touching catalog entities.
 */
@Service
public class ProductReviewService
        extends BaseDataService<ProductReviewModel, ProductReviewRepository>
        implements com.minglemart.shared.contracts.ReviewOperations {

    private static final int MAX_PAGE = 100;

    private final ProductRatingRepository ratings;
    private final ProductService products;

    public ProductReviewService(ProductReviewRepository repository,
                                ProductRatingRepository ratings,
                                ProductService products) {
        super(repository);
        this.ratings = ratings;
        this.products = products;
    }

    @Override
    protected String entityName() {
        return "Review";
    }

    // ----------------------------------------------------------- contract ---

    @Override
    @Transactional
    public Review submit(UUID productId, UUID userId, Draft draft, ActorRef actor) {
        rejectUnattendedAgent(actor);
        validate(draft);

        // Upsert: the database allows one review per person per product, so a
        // resubmission is the shopper correcting themselves, not a duplicate.
        ProductReviewModel review = repository.findByProductIdAndUserId(productId, userId)
                .orElseGet(() -> ProductReviewModel.builder()
                        .product(products.getOrThrow(productId))
                        .userId(userId)
                        .build());

        review.setRating(draft.rating());
        review.setTitle(draft.title());
        review.setBody(draft.body());

        return toReview(repository.save(review));
    }

    @Override
    @Transactional
    public void withdraw(UUID reviewId, UUID userId, ActorRef actor) {
        rejectUnattendedAgent(actor);

        ProductReviewModel review = getOrThrow(reviewId);
        // Scoped by author: an id alone must not be enough to delete someone
        // else's review.
        if (!review.getUserId().equals(userId)) {
            throw new IllegalStateException("review %s does not belong to that user".formatted(reviewId));
        }

        repository.delete(review);
    }

    @Override
    public Optional<Review> findMine(UUID productId, UUID userId) {
        return repository.findByProductIdAndUserId(productId, userId).map(this::toReview);
    }

    @Override
    public List<Review> forProduct(UUID productId, int limit) {
        return repository.findByProductIdAndStatusOrderByCreatedAtDesc(
                        productId, ReviewStatus.PUBLISHED, PageRequest.of(0, Math.clamp(limit, 1, MAX_PAGE)))
                .stream()
                .map(this::toReview)
                .toList();
    }

    @Override
    public Optional<Rating> ratingOf(UUID productId) {
        return ratings.findByProductId(productId)
                .map(view -> new Rating(view.getProductId(), view.getAverageRating(), view.getReviewCount()));
    }

    // -------------------------------------------------------------- local ---

    /** The full aggregate, including the histogram, for a product page. */
    public Optional<ProductRatingView> ratingView(UUID productId) {
        return ratings.findByProductId(productId);
    }

    /** Moderation: hiding a review takes it straight out of the average. */
    @Transactional
    public ProductReviewModel moderate(UUID reviewId, ReviewStatus status) {
        return update(reviewId, review -> review.setStatus(status));
    }

    @Transactional
    public boolean markHelpful(UUID reviewId) {
        return repository.markHelpful(reviewId) == 1;
    }

    private void validate(Draft draft) {
        if (draft == null || draft.rating() < 1 || draft.rating() > 5) {
            throw new IllegalArgumentException("a review must carry a rating from 1 to 5");
        }
    }

    /**
     * A review is signed content. The assistant may help a shopper write one,
     * but it must not publish in their name unattended — the same rule the
     * integration services apply to anything that acts for a person.
     */
    private void rejectUnattendedAgent(ActorRef actor) {
        if (actor != null && actor.isAgent()) {
            throw new IllegalStateException(
                    "posting a review requires human confirmation; the agent may only propose it");
        }
    }

    private Review toReview(ProductReviewModel review) {
        return new Review(
                review.getId(),
                review.getProduct().getId(),
                review.getUserId(),
                review.getRating(),
                review.getTitle(),
                review.getBody(),
                review.isVerifiedPurchase(),
                review.getHelpfulCount(),
                review.getCreatedAt());
    }
}
