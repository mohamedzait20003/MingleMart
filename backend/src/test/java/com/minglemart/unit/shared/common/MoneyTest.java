package com.minglemart.unit.shared.common;

import com.minglemart.shared.common.Money;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

class MoneyTest {

    @Test
    void rejectsANonIsoCurrency() {
        assertThatThrownBy(() -> Money.of("1.00", "DOLLARS"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("ISO-4217");
    }

    @Test
    void addsAmountsOfTheSameCurrency() {
        assertThat(Money.of("10.50", "USD").plus(Money.of("4.50", "USD")))
                .isEqualTo(new Money(new BigDecimal("15.00"), "USD"));
    }

    @Test
    void refusesToAddDifferentCurrencies() {
        // The bug this prevents is silent: adding EUR to USD as if they were
        // interchangeable produces a plausible-looking wrong total.
        assertThatThrownBy(() -> Money.of("10.00", "USD").plus(Money.of("10.00", "EUR")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("USD")
                .hasMessageContaining("EUR");
    }

    @Test
    void multipliesByQuantity() {
        assertThat(Money.of("2.50", "USD").times(4).amount())
                .isEqualByComparingTo("10.00");
    }

    @Test
    void keepsScaleExactly() {
        // Decimal, not floating point: 0.1 + 0.2 must be 0.3, not 0.30000000004
        assertThat(Money.of("0.1", "USD").plus(Money.of("0.2", "USD")).amount())
                .isEqualByComparingTo("0.3");
    }
}
