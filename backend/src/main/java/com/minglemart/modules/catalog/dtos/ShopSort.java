package com.minglemart.modules.catalog.dtos;

/** Ordering options for the shop grid. Values mirror the {@code sort} query parameter. */
public enum ShopSort {

    RELEVANCE("relevance"),
    PRICE_ASC("price-asc"),
    PRICE_DESC("price-desc"),
    RATING("rating"),
    NEWEST("newest");

    private final String parameter;

    ShopSort(String parameter) {
        this.parameter = parameter;
    }

    public String parameter() {
        return parameter;
    }

    /** Falls back to {@link #RELEVANCE} for anything unrecognised. */
    public static ShopSort from(String raw) {
        if (raw == null || raw.isBlank()) {
            return RELEVANCE;
        }

        for (ShopSort sort : values()) {
            if (sort.parameter.equalsIgnoreCase(raw.trim())) {
                return sort;
            }
        }

        return RELEVANCE;
    }
}
