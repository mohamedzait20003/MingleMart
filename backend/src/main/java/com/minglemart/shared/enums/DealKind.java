package com.minglemart.shared.enums;

/**
 * What sort of campaign a deal is. Mirrors the CHECK constraint on
 * {@code deals.kind}. Purely presentational — the storefront groups by it, and
 * nothing about pricing depends on which one is chosen.
 */
public enum DealKind {
    FLASH,
    DAILY,
    CLEARANCE,
    BUNDLE,
    CAMPAIGN
}
