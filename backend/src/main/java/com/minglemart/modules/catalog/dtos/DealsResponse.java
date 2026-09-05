package com.minglemart.modules.catalog.dtos;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.minglemart.shared.common.Money;
import com.minglemart.shared.enums.DealKind;

/**
 * The deals page. {@code flash} is the headline strip and {@code daily} is the
 * browsable remainder — the same list split, never two different queries, so a
 * price cannot disagree between the two sections.
 */
public record DealsResponse(
        Summary summary,
        List<Item> flash,
        List<Item> daily,
        List<CategoryTab> categories) {

    /** Hero figures. {@code nextEndsAt} drives the countdown. */
    public record Summary(
            int dealCount,
            BigDecimal deepestPercentOff,
            Money totalSavings,
            Instant nextEndsAt) {
    }

    public record Item(
            ProductCardDto product,
            UUID dealId,
            String dealSlug,
            String dealTitle,
            DealKind dealKind,
            String badgeText,
            Instant endsAt,
            Money savings,
            /** Null when the offer is unlimited: there is no "4 left" to show. */
            Integer unitsLeft,
            int percentClaimed) {
    }

    /** Only categories that actually have a deal today get a tab. */
    public record CategoryTab(
            UUID categoryId,
            String slug,
            String name,
            int count) {
    }
}
