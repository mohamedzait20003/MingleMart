package com.minglemart.modules.identity.common;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

/**
 * One-way hashing for opaque tokens.
 *
 * <p>Deliberately SHA-256 rather than bcrypt/argon2. Those are for passwords:
 * slow by design, and salted, so the same input hashes differently every time -
 * which makes lookup by hash impossible. A refresh token is 256 bits of
 * randomness, so there is nothing to brute-force and no need to slow an
 * attacker down; what matters is that the value is deterministic enough to
 * index and irreversible enough that a leaked database yields nothing usable.
 */
public final class TokenHasher {

    private TokenHasher() {
    }

    /** Lowercase hex SHA-256. 64 characters. */
    public static String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }

    /** Constant-time comparison, so it cannot be probed a character at a time. */
    public static boolean matches(String hash, String token) {
        if (hash == null || token == null) {
            return false;
        }
        return MessageDigest.isEqual(
                hash.getBytes(StandardCharsets.UTF_8),
                hash(token).getBytes(StandardCharsets.UTF_8));
    }
}
