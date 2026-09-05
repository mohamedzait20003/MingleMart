package com.minglemart.shared.enums;

/**
 * Mirrors the CHECK constraint on {@code deals.status}.
 *
 * <p>There is no SCHEDULED value on purpose: a deal is scheduled by giving it a
 * future {@code startsAt}, not by parking it in a status something has to flip
 * at midnight. ACTIVE means "switched on"; whether it is live right now is a
 * question for the clock.
 */
public enum DealStatus {
    DRAFT,
    ACTIVE,
    PAUSED,
    ARCHIVED
}
