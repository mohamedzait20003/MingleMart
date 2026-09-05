package com.minglemart.modules.catalog.repositories;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.minglemart.modules.catalog.models.ProductVariantModel;
import com.minglemart.shared.domain.BaseRepository;

public interface ProductVariantRepository extends BaseRepository<ProductVariantModel> {

    Optional<ProductVariantModel> findBySku(String sku);

    boolean existsBySku(String sku);

    List<ProductVariantModel> findByProductIdOrderBySkuAsc(UUID productId);

    List<ProductVariantModel> findByProductIdAndActiveTrue(UUID productId);

    /** The one flagged by {@code ux_variants_default}. */
    Optional<ProductVariantModel> findByProductIdAndDefaultVariantTrue(UUID productId);

    /**
     * Default variants for many products at once. Resolving them one product at
     * a time is the N+1 that makes a search results page slow.
     */
    List<ProductVariantModel> findByProductIdInAndDefaultVariantTrue(Collection<UUID> productIds);

    /**
     * Variants with their product and category already loaded. A storefront grid
     * reads all three per tile, and letting them lazy-load turns one page into
     * dozens of round trips.
     */
    @Query("""
            SELECT v FROM ProductVariantModel v
            JOIN   FETCH v.product p
            LEFT   JOIN FETCH p.category
            WHERE  v.id IN :ids
            """)
    List<ProductVariantModel> findAllForDisplay(@Param("ids") Collection<UUID> ids);
}
