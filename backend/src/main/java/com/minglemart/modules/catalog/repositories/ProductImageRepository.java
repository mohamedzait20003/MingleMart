package com.minglemart.modules.catalog.repositories;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.minglemart.modules.catalog.models.ProductImageModel;

/**
 * Extends {@code JpaRepository} rather than {@code BaseRepository}:
 * {@code product_images} records {@code created_at} but no {@code updated_at},
 * so the entity does not extend {@code BaseModel}.
 */
public interface ProductImageRepository extends JpaRepository<ProductImageModel, UUID> {

    List<ProductImageModel> findByProductIdOrderByPositionAsc(UUID productId);

    /** Variant-specific shots, for when a colour swatch swaps the gallery. */
    List<ProductImageModel> findByVariantIdOrderByPositionAsc(UUID variantId);

    /**
     * Images for a whole grid in one query. Fetching the lead image per card
     * separately is the N+1 that makes a 12-tile page twelve round trips.
     */
    List<ProductImageModel> findByProductIdInOrderByPositionAsc(Collection<UUID> productIds);
}
