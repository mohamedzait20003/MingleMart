package com.minglemart.modules.catalog.models;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;

import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.minglemart.shared.common.Money;

/**
 * What one unit of a variant costs right now, and why. Backed by the
 * {@code variant_effective_prices} view.
 *
 * <p>Read-only by construction: there are no setters, and {@code @Immutable}
 * keeps Hibernate from ever attempting a write. Every variant appears exactly
 * once, on offer or not, so a price lookup needs no null handling at the call
 * site — {@link #getEffectivePriceAmount()} is the list price when nothing
 * applies.
 *
 * <p>Only per-unit offers are reflected here. Buy-X-get-Y and bundles depend on
 * what else is in the basket, so the cart settles those.
 */
@Entity
@Immutable
@Table(name = "variant_effective_prices")
@Getter
@NoArgsConstructor
public class VariantPriceView {

    @Id
    @Column(name = "variant_id")
    private UUID variantId;

    @Column(name = "product_id")
    private UUID productId;

    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(length = 3)
    private String currency;

    /** The struck-through "was" figure. */
    @Column(name = "list_price_amount")
    private BigDecimal listPriceAmount;

    /** What the shopper pays for one unit. */
    @Column(name = "effective_price_amount")
    private BigDecimal effectivePriceAmount;

    @Column(name = "savings_amount")
    private BigDecimal savingsAmount;

    /** The offer that won, or null when the variant is at list price. */
    @Column(name = "offer_id")
    private UUID offerId;

    /** The campaign behind {@link #offerId}, null for a standalone markdown. */
    @Column(name = "deal_id")
    private UUID dealId;

    @Column(name = "on_offer")
    private boolean onOffer;

    public Money listPrice() {
        return new Money(listPriceAmount, currency);
    }

    public Money effectivePrice() {
        return new Money(effectivePriceAmount, currency);
    }

    public Money savings() {
        return new Money(savingsAmount, currency);
    }
}
