package com.minglemart.modules.catalog.config;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;

import com.minglemart.modules.catalog.dtos.ShopSort;

/**
 * Where the storefront's cached reads live in Redis, and how long they last.
 *
 * <p>Each service caches its own piece rather than one service caching whole
 * pages: the category tiles outlive the hero countdown by minutes, and there is
 * no reason for one to expire the other.
 *
 * <p>Every key sits under {@link #PREFIX}, so a write that changes what shoppers
 * see clears the whole storefront in one call without knowing which reads exist.
 *
 * <p>TTLs are set by how quickly each payload goes wrong, not by how expensive
 * it is to build.
 */
public final class StorefrontCacheKeys {

    /** Everything the storefront caches. Also the invalidation prefix. */
    public static final String PREFIX = "storefront:";

    public static final String CATEGORY_TILES = PREFIX + "categories:tiles";
    public static final String CATEGORY_FACETS = PREFIX + "categories:facets";
    public static final String TRENDING = PREFIX + "trending";
    public static final String DEAL_OF_THE_DAY = PREFIX + "hero";
    public static final String DEALS = PREFIX + "deals";
    private static final String SHOP = PREFIX + "shop:";

    /** Departments barely move, and any change to them evicts this anyway. */
    public static final Duration CATEGORIES_TTL = Duration.ofMinutes(10);

    public static final Duration TRENDING_TTL = Duration.ofMinutes(5);

    /** The hero carries a countdown and an allocation that moves as people buy. */
    public static final Duration DEAL_OF_THE_DAY_TTL = Duration.ofMinutes(2);

    /** Shortest of them all: "only 4 left" is the most perishable number here. */
    public static final Duration DEALS_TTL = Duration.ofSeconds(45);

    /** Longest: product data changes when a merchandiser acts, and that evicts. */
    public static final Duration SHOP_TTL = Duration.ofMinutes(5);

    private StorefrontCacheKeys() {
    }

    /**
     * One key per distinct query. The arguments are normalised by the caller
     * first — an unsorted category list or a trailing zero on a price would
     * otherwise be a second key for a query that is already cached.
     */
    public static String shop(String query,
                              List<String> categories,
                              BigDecimal minPrice,
                              BigDecimal maxPrice,
                              BigDecimal minRating,
                              ShopSort sort,
                              int page,
                              int size) {

        return SHOP + String.join("|",
                or(query),
                categories == null || categories.isEmpty() ? "-" : String.join(",", categories),
                or(minPrice),
                or(maxPrice),
                or(minRating),
                sort.name(),
                Integer.toString(page),
                Integer.toString(size));
    }

    private static String or(Object value) {
        return value == null ? "-" : value.toString();
    }
}
