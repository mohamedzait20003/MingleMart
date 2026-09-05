package com.minglemart.shared.enums;

/**
 * Mirrors the CHECK constraint on {@code product_reviews.status}.
 *
 * <p>Only PUBLISHED reviews reach the rating aggregate, so moderating one out
 * changes the score without deleting what the shopper wrote.
 */
public enum ReviewStatus {
    PENDING,
    PUBLISHED,
    REJECTED
}
