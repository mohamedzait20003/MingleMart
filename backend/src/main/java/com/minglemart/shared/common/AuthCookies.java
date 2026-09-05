package com.minglemart.shared.common;

/**
 * Names of the cookies a signed-in browser carries.
 *
 * <p>In {@code shared} because two sides need them and neither may import the
 * other: identity writes these cookies, the security filter reads them.
 */
public final class AuthCookies {

    /** The access JWT. HttpOnly, short-lived. */
    public static final String ACCESS = "access";

    /** The opaque rolling refresh token. HttpOnly, scoped to /api/auth. */
    public static final String REFRESH = "refresh";

    /** Routing hints the frontend reads. Not HttpOnly, grants nothing. */
    public static final String SESSION = "session";

    private AuthCookies() {
    }
}
