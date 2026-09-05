package com.minglemart.modules.catalog.dtos;

import java.math.BigDecimal;
import java.util.UUID;

import com.minglemart.shared.common.Money;

/**
 * One product tile, shared by every storefront grid.
 *
 * <p>{@code variantId} is what a cart takes: the product is what the shopper
 * browses, the default variant is what they buy. {@code listPrice} equals
 * {@code price} when nothing is on offer, so a card can always render a
 * struck-through "was" by comparing the two rather than null-checking.
 *
 * <p>{@code rating} is null when nobody has reviewed the product — unrated,
 * which a card should show differently from a bad score.
 */
public record ProductCardDto(
        UUID variantId,
        UUID productId,
        String slug,
        String name,
        String brand,
        String sku,
        String categorySlug,
        Money price,
        Money listPrice,
        BigDecimal percentOff,
        boolean onOffer,
        String imageUrl,
        BigDecimal rating,
        long reviewCount) {
}
