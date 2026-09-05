package com.minglemart.modules.catalog.dtos;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.minglemart.shared.common.Money;

/**
 * Everything the home page renders, in one call: the category tiles, the
 * trending strip and the single headline offer.
 */
public record LandingResponse(
        List<CategoryTile> categories,
        List<ProductCardDto> trending,
        DealOfTheDay dealOfTheDay) {

    public record CategoryTile(
            UUID id,
            String slug,
            String name,
            String description,
            long productCount) {
    }

    /**
     * The hero offer. Null when no featured campaign is live — the section
     * should disappear rather than render an empty countdown.
     */
    public record DealOfTheDay(
            UUID dealId,
            String slug,
            String title,
            String headline,
            String badgeText,
            String bannerImageUrl,
            Instant endsAt,
            ProductCardDto product,
            Money savings,
            Integer unitsLeft,
            int percentClaimed) {
    }
}
