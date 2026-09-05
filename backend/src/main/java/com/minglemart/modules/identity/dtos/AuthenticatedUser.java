package com.minglemart.modules.identity.dtos;

import java.util.UUID;

import com.minglemart.modules.identity.models.UserModel;

/**
 * What an auth endpoint returns in {@code data}.
 *
 * <p>No access or refresh token here on purpose: both travel as HttpOnly
 * cookies, so nothing the browser can read ever holds a credential.
 *
 * @param publicUserId derived session id, SHA-256(salt + handle), with both
 *                     halves kept server-side. Prefixes the caller's URLs and
 *                     is returned on reload to confirm the session.
 */
public record AuthenticatedUser(
        UUID id,
        String username,
        String email,
        String displayName,
        String role,
        boolean verified,
        String publicUserId) {

    /** For responses that open no session - sign-up, password reset. */
    public static AuthenticatedUser from(UserModel user) {
        return from(user, null);
    }

    public static AuthenticatedUser from(UserModel user, String publicUserId) {
        return new AuthenticatedUser(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.displayName(),
                user.getRole() != null ? user.getRole().getName() : null,
                user.isVerified(),
                publicUserId);
    }
}
