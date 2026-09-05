package com.minglemart.modules.catalog.dtos;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * A page of the shop grid, plus what the filter rail needs to draw itself.
 *
 * <p>{@code applied} echoes the filters actually used after clamping, so the
 * client can render the active-filter chips from the response rather than
 * re-deriving them and risking a disagreement with what was queried.
 */
public record ShopResponse(
        List<ProductCardDto> products,
        PageInfo page,
        List<CategoryFacet> categories,
        AppliedFilters applied) {

    /** {@code page} is 1-based, matching the {@code ?page=} the storefront uses. */
    public record PageInfo(
            int page,
            int size,
            long totalItems,
            int totalPages,
            boolean hasNext) {
    }

    /** Catalogue-wide counts: they do not narrow as other filters are applied. */
    public record CategoryFacet(
            UUID id,
            String slug,
            String name,
            long count) {
    }

    public record AppliedFilters(
            String q,
            List<String> categories,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            /** Minimum average rating; null means unrated products are included. */
            BigDecimal minRating,
            ShopSort sort) {
    }
}
