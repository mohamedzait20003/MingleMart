package com.minglemart.modules.catalog.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minglemart.modules.catalog.config.StorefrontCacheKeys;
import com.minglemart.modules.catalog.dtos.ProductCardDto;
import com.minglemart.modules.catalog.dtos.ShopResponse;
import com.minglemart.modules.catalog.dtos.ShopSort;
import com.minglemart.modules.catalog.models.ProductImageModel;
import com.minglemart.modules.catalog.models.ProductModel;
import com.minglemart.modules.catalog.models.ProductRatingView;
import com.minglemart.modules.catalog.models.ProductVariantModel;
import com.minglemart.modules.catalog.models.VariantPriceView;
import com.minglemart.modules.catalog.repositories.ProductImageRepository;
import com.minglemart.modules.catalog.repositories.ProductRatingRepository;
import com.minglemart.modules.catalog.repositories.ProductRepository;
import com.minglemart.modules.catalog.repositories.ProductVariantRepository;
import com.minglemart.modules.catalog.repositories.VariantPriceRepository;
import com.minglemart.shared.common.Money;
import com.minglemart.shared.domain.BaseDataService;
import com.minglemart.shared.enums.ProductStatus;
import com.minglemart.shared.infra.RedisStore;

/**
 * Products, and the cards the storefront renders them as.
 *
 * <p>Card assembly lives here because a product card is a fact about a product.
 * The deals page builds its own cards from its own view but reuses
 * {@link #leadImages} and {@link #ratingsOf} rather than repeating the two
 * batch lookups that keep a grid from becoming an N+1.
 */
@Service
public class ProductService extends BaseDataService<ProductModel, ProductRepository> {

    private static final int MAX_SEARCH_RESULTS = 50;
    private static final int TRENDING_COUNT = 8;

    private final ProductVariantRepository variants;
    private final ProductImageRepository images;
    private final ProductRatingRepository ratings;
    private final VariantPriceRepository prices;
    private final PricingService pricing;
    private final CategoryService categories;
    private final RedisStore cache;

    public ProductService(ProductRepository repository,
                          ProductVariantRepository variants,
                          ProductImageRepository images,
                          ProductRatingRepository ratings,
                          VariantPriceRepository prices,
                          PricingService pricing,
                          CategoryService categories,
                          RedisStore cache) {
        super(repository);
        this.variants = variants;
        this.images = images;
        this.ratings = ratings;
        this.prices = prices;
        this.pricing = pricing;
        this.categories = categories;
        this.cache = cache;
    }

    @Override
    protected String entityName() {
        return "Product";
    }

    public Optional<ProductModel> findBySlug(String slug) {
        return repository.findBySlug(slug);
    }

    public boolean slugTaken(String slug) {
        return repository.existsBySlug(slug);
    }

    public Page<ProductModel> published(Pageable pageable) {
        return repository.findByStatus(ProductStatus.ACTIVE, pageable);
    }

    public Page<ProductModel> publishedIn(UUID categoryId, Pageable pageable) {
        return repository.findByCategoryIdAndStatus(categoryId, ProductStatus.ACTIVE, pageable);
    }

    /** Blank searches return nothing rather than the whole catalogue. */
    public List<ProductModel> search(String term, int limit) {
        if (term == null || term.isBlank()) {
            return List.of();
        }
        return repository.search(term.trim(), Math.clamp(limit, 1, MAX_SEARCH_RESULTS));
    }

    // ---------------------------------------------------------- storefront ---

    /**
     * Newest arrivals, standing in for genuine popularity: nothing records what
     * sells yet, and ranking by an invented number would be worse than ranking
     * by a real one that means something slightly different.
     */
    public List<ProductCardDto> trending() {
        Optional<List<ProductCardDto>> hit =
                cache.getList(StorefrontCacheKeys.TRENDING, ProductCardDto.class);
        if (hit.isPresent()) {
            return hit.get();
        }

        Page<ProductModel> newest = repository.findByStatus(
                ProductStatus.ACTIVE,
                PageRequest.of(0, TRENDING_COUNT, Sort.by(Sort.Direction.DESC, "createdAt")));

        List<ProductCardDto> cards = cardsFor(newest.getContent());
        cache.set(StorefrontCacheKeys.TRENDING, cards, StorefrontCacheKeys.TRENDING_TTL);
        return cards;
    }

    /**
     * A page of the shop grid. One cache entry per distinct query — the
     * controller normalises the arguments first, so the same search is the same
     * key rather than a second copy of an answer already held.
     */
    public ShopResponse shop(String query,
                             List<String> categorySlugs,
                             BigDecimal minPrice,
                             BigDecimal maxPrice,
                             BigDecimal minRating,
                             ShopSort sort,
                             int page,
                             int size) {

        String key = StorefrontCacheKeys.shop(query, categorySlugs, minPrice, maxPrice,
                minRating, sort, page, size);

        Optional<ShopResponse> hit = cache.get(key, ShopResponse.class);
        if (hit.isPresent()) {
            return hit.get();
        }

        // The storefront pages from 1; Spring Data counts from 0.
        Page<VariantPriceView> found = prices.shop(
                blankToNull(query),
                categorySlugs == null || categorySlugs.isEmpty() ? null : String.join(",", categorySlugs),
                minPrice,
                maxPrice,
                minRating,
                sort.name(),
                PageRequest.of(Math.max(page, 1) - 1, size));

        ShopResponse.PageInfo info = new ShopResponse.PageInfo(
                found.getNumber() + 1,
                found.getSize(),
                found.getTotalElements(),
                found.getTotalPages(),
                found.hasNext());

        ShopResponse response = new ShopResponse(
                cardsForPrices(found.getContent()),
                info,
                categories.facets(),
                new ShopResponse.AppliedFilters(
                        blankToNull(query),
                        categorySlugs == null ? List.of() : categorySlugs,
                        minPrice, maxPrice, minRating, sort));

        cache.set(key, response, StorefrontCacheKeys.SHOP_TTL);
        return response;
    }

    // ------------------------------------------------------ card assembly ---

    /** Cards for a list of products, via each product's default variant. */
    public List<ProductCardDto> cardsFor(List<ProductModel> found) {
        if (found.isEmpty()) {
            return List.of();
        }

        List<UUID> productIds = found.stream().map(ProductModel::getId).toList();

        Map<UUID, ProductVariantModel> defaults = variants
                .findByProductIdInAndDefaultVariantTrue(productIds)
                .stream()
                .collect(Collectors.toMap(v -> v.getProduct().getId(), Function.identity()));

        Map<UUID, VariantPriceView> priced = pricing.pricesOf(
                defaults.values().stream().map(ProductVariantModel::getId).toList());

        Map<UUID, String> lead = leadImages(productIds);
        Map<UUID, ProductRatingView> rated = ratingsOf(productIds);

        // A product with no default variant cannot be priced or added to a cart,
        // so it is left out rather than rendered as an unbuyable tile.
        return found.stream()
                .map(product -> {
                    ProductVariantModel variant = defaults.get(product.getId());
                    return variant == null ? null
                            : card(product, variant, priced.get(variant.getId()),
                                   lead.get(product.getId()), rated.get(product.getId()));
                })
                .filter(Objects::nonNull)
                .toList();
    }

    /** Cards for an already-priced page, preserving the order the query returned. */
    public List<ProductCardDto> cardsForPrices(List<VariantPriceView> priced) {
        if (priced.isEmpty()) {
            return List.of();
        }

        Map<UUID, ProductVariantModel> byVariant = variants
                .findAllForDisplay(priced.stream().map(VariantPriceView::getVariantId).toList())
                .stream()
                .collect(Collectors.toMap(ProductVariantModel::getId, Function.identity()));

        List<UUID> productIds = priced.stream().map(VariantPriceView::getProductId).toList();
        Map<UUID, String> lead = leadImages(productIds);
        Map<UUID, ProductRatingView> rated = ratingsOf(productIds);

        return priced.stream()
                .map(price -> {
                    ProductVariantModel variant = byVariant.get(price.getVariantId());
                    return variant == null ? null
                            : card(variant.getProduct(), variant, price,
                                   lead.get(price.getProductId()), rated.get(price.getProductId()));
                })
                .filter(Objects::nonNull)
                .toList();
    }

    /** First image per product, by position. One query for a whole grid. */
    public Map<UUID, String> leadImages(Collection<UUID> productIds) {
        if (productIds.isEmpty()) {
            return Map.of();
        }

        Map<UUID, String> lead = new LinkedHashMap<>();
        for (ProductImageModel image : images.findByProductIdInOrderByPositionAsc(productIds)) {
            lead.putIfAbsent(image.getProduct().getId(), image.getUrl());
        }

        return lead;
    }

    /** Ratings for a whole grid in one query; absent means unrated. */
    public Map<UUID, ProductRatingView> ratingsOf(Collection<UUID> productIds) {
        if (productIds.isEmpty()) {
            return Map.of();
        }

        return ratings.findByProductIdIn(productIds).stream()
                .collect(Collectors.toMap(ProductRatingView::getProductId, Function.identity()));
    }

    /** Percentage saved, rounded for display; zero when nothing is off. */
    public static BigDecimal percentOff(BigDecimal list, BigDecimal effective) {
        if (list == null || effective == null || list.signum() <= 0) {
            return BigDecimal.ZERO;
        }

        return list.subtract(effective)
                .multiply(BigDecimal.valueOf(100))
                .divide(list, 0, RoundingMode.HALF_UP);
    }

    private ProductCardDto card(ProductModel product,
                                ProductVariantModel variant,
                                VariantPriceView price,
                                String imageUrl,
                                ProductRatingView rating) {

        Money effective = price != null ? price.effectivePrice() : variant.listPrice();
        Money list = price != null ? price.listPrice() : variant.listPrice();

        // Derived from the money, not from the view's flag. An offer can win the
        // shelf and still save nothing — a fixed price entered above list is
        // clamped — and a card that badges "sale" over an unchanged price is a
        // lie the shopper can check.
        boolean onOffer = list.amount().compareTo(effective.amount()) > 0;

        return new ProductCardDto(
                variant.getId(),
                product.getId(),
                product.getSlug(),
                product.getName(),
                product.getBrand(),
                variant.getSku(),
                product.getCategory() == null ? null : product.getCategory().getSlug(),
                effective,
                list,
                percentOff(list.amount(), effective.amount()),
                onOffer,
                imageUrl,
                rating == null ? null : rating.getAverageRating(),
                rating == null ? 0L : rating.getReviewCount());
    }

    /** An empty search box is not a search for the empty string. */
    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    // -------------------------------------------------------------- writes ---

    /**
     * A product with no variants has nothing to sell and nothing to price, so
     * publishing it would put an unbuyable card on the storefront.
     */
    @Transactional
    public ProductModel publish(UUID productId) {
        ProductModel product = getOrThrow(productId);
        if (product.getVariants().isEmpty()) {
            throw new IllegalStateException("product %s has no variants to sell".formatted(productId));
        }
        product.setStatus(ProductStatus.ACTIVE);
        ProductModel published = repository.save(product);

        // A newly published product changes the grid, the counts and possibly
        // the deals page, and there is no way to know which cached reads.
        cache.evictByPrefix(StorefrontCacheKeys.PREFIX);
        return published;
    }

    @Transactional
    public ProductModel archive(UUID productId) {
        ProductModel archived = update(productId, product -> product.setStatus(ProductStatus.ARCHIVED));
        cache.evictByPrefix(StorefrontCacheKeys.PREFIX);
        return archived;
    }
}
