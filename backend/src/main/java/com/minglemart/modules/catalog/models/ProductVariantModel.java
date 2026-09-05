package com.minglemart.modules.catalog.models;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.minglemart.shared.common.Money;
import com.minglemart.shared.domain.BaseModel;

/**
 * The thing that is actually priced, stocked and bought (size 42, blue).
 * Everything downstream — cart, order, inventory — references this, never
 * {@link ProductModel}.
 *
 * <p>{@link #priceAmount} is the LIST price and does not move when a sale
 * starts. What a shopper actually pays is the list price with the best live
 * offer applied, which is read from {@link VariantPriceView}.
 */
@Entity
@Table(name = "product_variants")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantModel extends BaseModel {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private ProductModel product;

    @Column(nullable = false, unique = true, length = 64)
    private String sku;

    @Column(nullable = false)
    private String name;

    @Column(name = "price_amount", nullable = false, precision = 19, scale = 4)
    private BigDecimal priceAmount;

    @Builder.Default
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(nullable = false, length = 3)
    private String currency = "USD";

    private Integer weightGrams;

    /** Mapped to {@code is_default}; exactly one per product carries it. */
    @Builder.Default
    @Column(name = "is_default", nullable = false)
    private boolean defaultVariant = false;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "variant", fetch = FetchType.LAZY,
               cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<VariantAttributeModel> attributes = new LinkedHashSet<>();

    /** The list price as money. Not what the shopper pays if an offer applies. */
    public Money listPrice() {
        return new Money(priceAmount, currency);
    }

    public void addAttribute(String name, String value) {
        attributes.add(VariantAttributeModel.builder()
                .variant(this)
                .name(name)
                .value(value)
                .build());
    }
}
