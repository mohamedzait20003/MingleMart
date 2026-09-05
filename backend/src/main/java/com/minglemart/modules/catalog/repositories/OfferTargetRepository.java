package com.minglemart.modules.catalog.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.minglemart.modules.catalog.models.OfferTargetModel;

/**
 * Extends {@code JpaRepository} rather than {@code BaseRepository}:
 * {@code offer_targets} records {@code created_at} but no {@code updated_at},
 * so the entity does not extend {@code BaseModel}.
 */
public interface OfferTargetRepository extends JpaRepository<OfferTargetModel, UUID> {

    List<OfferTargetModel> findByOfferIdOrderByPositionAsc(UUID offerId);

    List<OfferTargetModel> findByOfferIdAndExclusion(UUID offerId, boolean exclusion);

    /** Every offer currently pointed at this product, inclusions and exclusions. */
    List<OfferTargetModel> findByProductId(UUID productId);

    List<OfferTargetModel> findByVariantId(UUID variantId);

    List<OfferTargetModel> findByCategoryId(UUID categoryId);
}
