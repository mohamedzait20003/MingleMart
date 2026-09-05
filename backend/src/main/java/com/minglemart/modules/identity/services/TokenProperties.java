package com.minglemart.modules.identity.services;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Token lifetimes and the signing secret.
 *
 * @param secret    HMAC key for access tokens. Must be at least 32 bytes for
 *                  HS256; supply it per environment, never commit a real one.
 * @param accessTtl how long an access token stays valid. Short by design - it
 *                  cannot be revoked before it expires, so its blast radius is
 *                  its lifetime.
 * @param refreshTtl how long a refresh token (a `sessions` row) stays valid.
 * @param issuer    the `iss` claim.
 * @param secureCookies whether cookies carry the Secure flag. False for plain
 *                  http://localhost during development; true everywhere else.
 */
@ConfigurationProperties(prefix = "minglemart.token")
public record TokenProperties(
        String secret,
        Duration accessTtl,
        Duration refreshTtl,
        String issuer,
        boolean secureCookies) {

    public TokenProperties {
        accessTtl = accessTtl != null ? accessTtl : Duration.ofMinutes(15);
        refreshTtl = refreshTtl != null ? refreshTtl : Duration.ofDays(30);
        issuer = issuer != null ? issuer : "minglemart";
    }
}
