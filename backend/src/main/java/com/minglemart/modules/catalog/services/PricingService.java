package com.minglemart.modules.catalog.services;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minglemart.modules.catalog.models.DealItemView;
import com.minglemart.modules.catalog.models.VariantPriceView;
import com.minglemart.modules.catalog.repositories.DealItemRepository;
import com.minglemart.modules.catalog.repositories.VariantPriceRepository;

/**
 * Reads what things cost. The arithmetic lives in the
 * {@code variant_effective_prices} and {@code active_deal_items} views, not
 * here — the agent, the storefront and the cart all have to agree on a price,
 * and the moment that is reimplemented in Java it starts to disagree with SQL.
 */
@Service
@Transactional(readOnly = true)
public class PricingService {

    private final VariantPriceRepository prices;
    private final DealItemRepository dealItems;

    public PricingService(VariantPriceRepository prices, DealItemRepository dealItems) {
        this.prices = prices;
        this.dealItems = dealItems;
    }

    public Optional<VariantPriceView> priceOf(UUID variantId) {
        return prices.findByVariantId(variantId);
    }

    /** One round trip for a whole cart or results page. */
    public Map<UUID, VariantPriceView> pricesOf(Collection<UUID> variantIds) {
        if (variantIds.isEmpty()) {
            return Map.of();
        }
        return prices.findByVariantIdIn(variantIds).stream()
                .collect(Collectors.toMap(VariantPriceView::getVariantId, Function.identity()));
    }

    public List<VariantPriceView> pricesForProduct(UUID productId) {
        return prices.findByProductId(productId);
    }

    public boolean isOnOffer(UUID variantId) {
        return priceOf(variantId).map(VariantPriceView::isOnOffer).orElse(false);
    }

    // --- the deals page ---

    public List<DealItemView> allDeals() {
        return dealItems.findAllByOrderByPercentOffDesc();
    }

    public List<DealItemView> dealsIn(UUID categoryId) {
        return dealItems.findByCategoryIdOrderByPercentOffDesc(categoryId);
    }

    public List<DealItemView> itemsOf(String dealSlug) {
        return dealItems.findByDealSlugOrderByPercentOffDesc(dealSlug);
    }

    public List<DealItemView> headlineDeals(int limit) {
        return dealItems.findByFeaturedTrueOrderByPriorityDescPercentOffDesc(PageRequest.of(0, Math.max(limit, 1)));
    }

    public long dealCount() {
        return dealItems.count();
    }
}
