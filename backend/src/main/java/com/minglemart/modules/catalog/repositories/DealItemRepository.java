package com.minglemart.modules.catalog.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;

import com.minglemart.modules.catalog.models.DealItemView;

/**
 * Reads the {@code active_deal_items} view — the deals page in one query.
 *
 * <p>A plain {@code Repository} rather than {@code JpaRepository}, for the same
 * reason as {@link VariantPriceRepository}: there is nothing here to write.
 */
public interface DealItemRepository extends Repository<DealItemView, UUID> {

    /** Everything on sale right now, deepest cut first. */
    List<DealItemView> findAllByOrderByPercentOffDesc();

    List<DealItemView> findByDealSlugOrderByPercentOffDesc(String dealSlug);

    List<DealItemView> findByDealId(UUID dealId);

    List<DealItemView> findByCategoryIdOrderByPercentOffDesc(UUID categoryId);

    /** The headline offers, for the hero and the flash-deal strip. */
    List<DealItemView> findByFeaturedTrueOrderByPriorityDescPercentOffDesc(Pageable pageable);

    long count();
}
