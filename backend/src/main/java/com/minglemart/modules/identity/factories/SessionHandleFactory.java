package com.minglemart.modules.identity.factories;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;

import org.springframework.stereotype.Component;

import com.minglemart.shared.domain.BaseFactory;

/**
 * Derives a session's client-facing handle.
 *
 * <p>Three values, two of which stay on the server:
 * <ul>
 *   <li><strong>handle</strong> - random, stored raw on the session row;</li>
 *   <li><strong>salt</strong> - random, stored beside it;</li>
 *   <li><strong>public id</strong> - {@code SHA-256(salt + handle)}, the only
 *       one the client ever sees. It travels in the session cookie, sits in the
 *       store, and prefixes every signed-in URL.</li>
 * </ul>
 *
 * <p>The server recomputes the public id from the two stored halves, so nothing
 * derived needs storing and a reload check is a hash rather than a lookup.
 *
 * <p>The salt is per session, so two sessions never derive the same public id
 * even if their handles collided - and the handle cannot be recovered from a
 * public id seen in a URL or a log.
 */
@Component
public class SessionHandleFactory extends BaseFactory {

    private static final SecureRandom RANDOM = new SecureRandom();

    /**
     * @param handle    raw value, persist as {@code sessions.public_user_id}
     * @param salt      persist as {@code sessions.public_user_id_salt}
     * @param publicId  what the client receives; never persisted
     */
    public record SessionHandle(String handle, String salt, String publicId) {
    }

    public SessionHandle mint() {
        String handle = random(16);
        String salt = random(16);

        return new SessionHandle(handle, salt, derive(handle, salt));
    }

    /**
     * Recomputes the client-facing id from the stored halves.
     *
     * <p>Used on reload to check what the client returned. Deterministic, so no
     * derived value has to be kept in sync.
     */
    public String derive(String handle, String salt) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest((salt + handle).getBytes(StandardCharsets.UTF_8));

            // Truncated to 128 bits: still far beyond guessing, and short enough
            // to read in a URL.
            return HexFormat.of().formatHex(digest).substring(0, 32);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }

    /** Constant-time, so a returned id cannot be probed a character at a time. */
    public boolean matches(String handle, String salt, String presentedPublicId) {
        if (handle == null || salt == null || presentedPublicId == null) {
            return false;
        }

        return MessageDigest.isEqual(
                derive(handle, salt).getBytes(StandardCharsets.UTF_8),
                presentedPublicId.getBytes(StandardCharsets.UTF_8));
    }

    private static String random(int bytes) {
        byte[] buffer = new byte[bytes];
        RANDOM.nextBytes(buffer);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(buffer);
    }
}
