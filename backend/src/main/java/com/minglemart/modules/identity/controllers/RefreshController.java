package com.minglemart.modules.identity.controllers;

import com.minglemart.shared.common.ApiResponse;


import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minglemart.modules.identity.dtos.AuthenticatedUser;
import com.minglemart.modules.identity.factories.AuthCookieFactory;
import com.minglemart.modules.identity.services.AuthService;

/**
 * POST /api/auth/refresh
 *
 * <p>The only endpoint that reads the refresh cookie, which is why that cookie
 * is scoped to /api/auth rather than / - it is not sent on requests that cannot
 * use it.
 *
 * <p>Both cookies are required: the access token carries the hash the refresh
 * token is checked against, so presenting one without the other fails.
 */
@RestController
@RequestMapping("/api/auth")
public class RefreshController extends AuthController {

    private final AuthService auth;
    private final AuthCookieFactory cookies;

    public RefreshController(AuthService auth, AuthCookieFactory cookies) {
        this.auth = auth;
        this.cookies = cookies;
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthenticatedUser>> refresh(
            @CookieValue(name = AuthCookieFactory.ACCESS_COOKIE, required = false) String access,
            @CookieValue(name = AuthCookieFactory.REFRESH_COOKIE, required = false) String refresh,
            HttpServletRequest http) {

        AuthService.Established established = auth.refresh(access, refresh, http);

        return withCookies(
                ok("Session renewed.", AuthenticatedUser.from(established.user(), established.publicUserId())),
                cookies.access(established.accessToken()),
                cookies.refresh(established.refreshToken()),
                cookies.session(established.user(), established.publicUserId()));
    }
}
