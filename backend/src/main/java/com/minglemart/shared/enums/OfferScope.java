package com.minglemart.shared.enums;

/**
 * What an offer target points at. Mirrors the CHECK constraint on
 * {@code offer_targets.scope}.
 *
 * <p>Scopes are resolved at read time, so filing a new product under a
 * discounted category puts it on sale without anyone touching the offer.
 */
public enum OfferScope {
    ALL,
    CATEGORY,
    BRAND,
    PRODUCT,
    VARIANT
}
