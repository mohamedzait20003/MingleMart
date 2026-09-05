package com.minglemart.modules.catalog.repositories;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.Repository;

import com.minglemart.modules.catalog.models.ProductRatingView;

/**
 * Reads the {@code product_ratings} view. Read-only by design, like the pricing
 * views: the aggregate is derived, so there is nothing here to write.
 */
public interface ProductRatingRepository extends Repository<ProductRatingView, UUID> {

    Optional<ProductRatingView> findByProductId(UUID productId);

    /** One round trip for a whole grid; ratings per card would be an N+1. */
    List<ProductRatingView> findByProductIdIn(Collection<UUID> productIds);
}
