package com.minglemart.shared.enums;

/**
 * External identity providers. Values mirror the CHECK constraint on
 * {@code oauth_accounts.provider}, so {@code @Enumerated(EnumType.STRING)}
 * round-trips without a converter.
 */
public enum OAuthProvider {
    GOOGLE,
    FACEBOOK,
    APPLE,
    GITHUB
}
