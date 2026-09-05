package com.minglemart.shared.enums;

/**
 * How an offer reduces a price. Mirrors the CHECK constraint on
 * {@code offers.discount_type}, and each value carries its own fields — see
 * {@code ck_offers_shape} in V2__catalog.sql.
 */
public enum DiscountType {

    /** {@code percent_off}, optionally capped by {@code max_discount_amount}. */
    PERCENTAGE,

    /** {@code amount_off} straight off the list price. */
    FIXED_AMOUNT,

    /** {@code fixed_price_amount} replaces the list price. */
    FIXED_PRICE,

    /** Buy {@code buy_quantity}, get {@code get_quantity} at a discount. */
    BUY_X_GET_Y,

    /** A set of variants for {@code fixed_price_amount} together. */
    BUNDLE;

    /**
     * Whether this discount can be resolved for a single unit in isolation.
     *
     * <p>BOGO and bundles cannot: they depend on what else is in the basket, so
     * the cart settles them and the shelf price ignores them.
     */
    public boolean isPerUnit() {
        return this == PERCENTAGE || this == FIXED_AMOUNT || this == FIXED_PRICE;
    }
}
