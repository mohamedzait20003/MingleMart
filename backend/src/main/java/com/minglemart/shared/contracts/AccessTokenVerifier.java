package com.minglemart.shared.contracts;

import java.util.Optional;
import java.util.UUID;

/**
 * Verifies an access token, implemented by the identity module.
 *
 * <p>Exists to break what would otherwise be a cycle. The security filter lives
 * in {@code shared} because it is cross-cutting; the token is minted by
 * {@code identity}. Without this contract the filter would import
 * {@code JwtService} and produce {@code identity -> shared -> identity}, which
 * {@code ModularityTests} fails on.
 */
public interface AccessTokenVerifier {

    /**
     * @return the caller, or empty when the token is missing, malformed,
     *         expired, or signed by someone else
     */
    Optional<Principal> verify(String accessToken);

    /**
     * Who is making the request, as asserted by a verified token.
     *
     * <p>Read straight from the claims - no database lookup. That is the whole
     * point of a JWT here: an ordinary request costs a signature check, not a
     * query.
     */
    record Principal(UUID userId, UUID sessionId, String role, boolean verified) {
    }
}
