package com.minglemart.modules.catalog.services;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minglemart.modules.catalog.config.StorefrontCacheKeys;
import com.minglemart.modules.catalog.dtos.DealsResponse;
import com.minglemart.modules.catalog.dtos.LandingResponse;
import com.minglemart.modules.catalog.dtos.ProductCardDto;
import com.minglemart.modules.catalog.models.CategoryModel;
import com.minglemart.modules.catalog.models.DealItemView;
import com.minglemart.modules.catalog.models.DealModel;
import com.minglemart.modules.catalog.models.ProductRatingView;
import com.minglemart.modules.catalog.repositories.DealRepository;
import com.minglemart.shared.common.Money;
import com.minglemart.shared.domain.BaseDataService;
import com.minglemart.shared.enums.DealStatus;
import com.minglemart.shared.infra.RedisStore;

/**
 * Campaigns, and the two storefront reads built on them: the deals page and the
 * single headline offer the home page leads with.
 */
@Service
public class DealService extends BaseDataService<DealModel, DealRepository> {
    private static final int FLASH_DEAL_COUNT = 4;

    private final PricingService pricing;
    private final ProductService products;
    private final CategoryService categories;
    private final RedisStore cache;

    public DealService(DealRepository repository, PricingService pricing, ProductService products, CategoryService categories, RedisStore cache) {
        super(repository);
        this.pricing = pricing;
        this.products = products;
        this.categories = categories;
        this.cache = cache;
    }

    @Override
    protected String entityName() {
        return "Deal";
    }

    public Optional<DealModel> findBySlug(String slug) {
        return repository.findBySlug(slug);
    }

    public boolean slugTaken(String slug) {
        return repository.existsBySlug(slug);
    }

    /** Campaigns running right now, highest priority first. */
    public List<DealModel> live() {
        return repository.findLive(Instant.now());
    }

    /** The featured campaign, if one is live. */
    public Optional<DealModel> hero() {
        return repository.findLiveFeatured(Instant.now(), PageRequest.of(0, 1)).stream().findFirst();
    }

    public List<DealModel> endingWithin(Duration horizon) {
        Instant now = Instant.now();
        return repository.findEndingBefore(now, now.plus(horizon));
    }

    //--- storefront ---
    public DealsResponse dealsPage() {
        Optional<DealsResponse> hit = cache.get(StorefrontCacheKeys.DEALS, DealsResponse.class);
        if (hit.isPresent()) {
            return hit.get();
        }

        List<DealItemView> live = pricing.allDeals();
        List<UUID> productIds = live.stream().map(DealItemView::getProductId).toList();

        Map<UUID, String> lead = products.leadImages(productIds);
        Map<UUID, ProductRatingView> rated = products.ratingsOf(productIds);
        Map<UUID, String> slugs = categories.slugsOf(live.stream()
                .map(DealItemView::getCategoryId)
                .filter(Objects::nonNull)
                .distinct()
                .toList());

        List<DealsResponse.Item> items = live.stream()
                .map(item -> toItem(item, lead, slugs, rated))
                .toList();

        DealsResponse response = new DealsResponse(
                summarise(live),
                items.stream().limit(FLASH_DEAL_COUNT).toList(),
                items.stream().skip(FLASH_DEAL_COUNT).toList(),
                categoryTabs(live));

        cache.set(StorefrontCacheKeys.DEALS, response, StorefrontCacheKeys.DEALS_TTL);
        return response;
    }

    /**
     * The hero offer for the home page. Empty when no featured campaign is live
     * — the section should disappear rather than render an empty countdown.
     */
    public Optional<LandingResponse.DealOfTheDay> dealOfTheDay() {
        Optional<LandingResponse.DealOfTheDay> hit =
                cache.get(StorefrontCacheKeys.DEAL_OF_THE_DAY, LandingResponse.DealOfTheDay.class);
        if (hit.isPresent()) {
            return hit;
        }

        Optional<LandingResponse.DealOfTheDay> hero = pricing.headlineDeals(1).stream().findFirst()
                .map(item -> {
                    List<UUID> ids = List.of(item.getProductId());
                    ProductCardDto card = toCard(item,
                            products.leadImages(ids),
                            categories.slugsOf(item.getCategoryId() == null ? List.of()
                                    : List.of(item.getCategoryId())),
                            products.ratingsOf(ids));

                    return new LandingResponse.DealOfTheDay(
                            item.getDealId(),
                            item.getDealSlug(),
                            item.getDealTitle(),
                            null,
                            item.getBadgeText(),
                            null,
                            item.getEndsAt(),
                            card,
                            item.savings(),
                            item.getUnitsLeft(),
                            item.percentClaimed());
                });

        hero.ifPresent(value -> cache.set(StorefrontCacheKeys.DEAL_OF_THE_DAY, value, StorefrontCacheKeys.DEAL_OF_THE_DAY_TTL));
        return hero;
    }

    private DealsResponse.Summary summarise(List<DealItemView> live) {
        BigDecimal deepest = live.stream()
                .map(DealItemView::getPercentOff)
                .filter(Objects::nonNull)
                .max(Comparator.naturalOrder())
                .orElse(BigDecimal.ZERO);

        // Savings only add up within a currency, so the headline is reported in
        // the first one seen rather than silently summing across them.
        String currency = live.isEmpty() ? "USD" : live.get(0).getCurrency();
        BigDecimal total = live.stream()
                .filter(item -> currency.equals(item.getCurrency()))
                .map(DealItemView::getSavingsAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DealsResponse.Summary(
                live.size(),
                deepest,
                new Money(total, currency),
                live.stream()
                        .map(DealItemView::getEndsAt)
                        .filter(Objects::nonNull)
                        .min(Comparator.naturalOrder())
                        .orElse(null));
    }

    /** Only categories that actually have a deal today get a tab. */
    private List<DealsResponse.CategoryTab> categoryTabs(List<DealItemView> live) {
        Map<UUID, Long> counts = live.stream().filter(item -> item.getCategoryId() != null).collect(Collectors.groupingBy(DealItemView::getCategoryId, Collectors.counting()));

        if (counts.isEmpty()) {
            return List.of();
        }

        return categories.byIds(counts.keySet()).stream().map(category -> new DealsResponse.CategoryTab(
            category.getId(),
            category.getSlug(),
            category.getName(),
            counts.getOrDefault(category.getId(), 0L).intValue())
        ).sorted(Comparator.comparing(DealsResponse.CategoryTab::name)).toList();
    }

    private DealsResponse.Item toItem(DealItemView item, Map<UUID, String> lead, Map<UUID, String> categorySlugs, Map<UUID, ProductRatingView> rated) {
        return new DealsResponse.Item(
            toCard(item, lead, categorySlugs, rated),
            item.getDealId(),
            item.getDealSlug(),
            item.getDealTitle(),
            item.getDealKind(),
            item.getBadgeText(),
            item.getEndsAt(),
            item.savings(),
            item.getUnitsLeft(),
            item.percentClaimed()
        );
    }

    /**
     * A card for one row of the deals view. Built here rather than by
     * ProductService because the view already carries the name, sku and both
     * prices — re-reading the product to assemble it would be wasted work.
     */
    private ProductCardDto toCard(DealItemView item, Map<UUID, String> lead, Map<UUID, String> categorySlugs, Map<UUID, ProductRatingView> rated) {

        ProductRatingView rating = rated.get(item.getProductId());

        return new ProductCardDto(
            item.getVariantId(),
            item.getProductId(),
            item.getProductSlug(),
            item.getProductName(),
            item.getBrand(),
            item.getSku(),
            categorySlugs.get(item.getCategoryId()),
            item.effectivePrice(),
            item.listPrice(),
            item.getPercentOff(),
            true,
            lead.get(item.getProductId()),
            rating == null ? null : rating.getAverageRating(),
            rating == null ? 0L : rating.getReviewCount()
        );
    }

    // --- writes ---

    @Transactional
    public DealModel activate(UUID dealId) {
        DealModel deal = getOrThrow(dealId);
        if (deal.getStatus() == DealStatus.ARCHIVED) {
            throw new IllegalStateException("deal %s is archived; copy it instead".formatted(dealId));
        }
        deal.setStatus(DealStatus.ACTIVE);
        DealModel activated = repository.save(deal);
        cache.evictByPrefix(StorefrontCacheKeys.PREFIX);
        return activated;
    }

    /** Takes every price under the campaign back to list, without losing it. */
    @Transactional
    public DealModel pause(UUID dealId) {
        DealModel paused = update(dealId, deal -> deal.setStatus(DealStatus.PAUSED));
        cache.evictByPrefix(StorefrontCacheKeys.PREFIX);
        return paused;
    }

    @Transactional
    public DealModel archive(UUID dealId) {
        DealModel archived = update(dealId, deal -> deal.setStatus(DealStatus.ARCHIVED));
        cache.evictByPrefix(StorefrontCacheKeys.PREFIX);
        return archived;
    }

    @Transactional
    public DealModel schedule(UUID dealId, Instant startsAt, Instant endsAt) {
        if (startsAt != null && endsAt != null && !endsAt.isAfter(startsAt)) {
            throw new IllegalArgumentException("a deal cannot end before it starts");
        }
        DealModel scheduled = update(dealId, deal -> {
            deal.setStartsAt(startsAt);
            deal.setEndsAt(endsAt);
        });
        cache.evictByPrefix(StorefrontCacheKeys.PREFIX);
        return scheduled;
    }

    @Transactional
    public DealModel feature(UUID dealId, boolean featured) {
        DealModel featuredDeal = update(dealId, deal -> deal.setFeatured(featured));
        cache.evictByPrefix(StorefrontCacheKeys.PREFIX);
        return featuredDeal;
    }
}
