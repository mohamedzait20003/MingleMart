package com.minglemart.modules.identity.controllers;

import com.minglemart.shared.common.ApiResponse;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minglemart.modules.identity.factories.AuthCookieFactory;
import com.minglemart.modules.identity.services.AuthService;

/**
 * POST /api/auth/sign-out
 *
 * <p>Revokes the session row behind the refresh cookie and expires all three
 * cookies. Always succeeds: signing out with no session is not an error.
 */
@RestController
@RequestMapping("/api/auth")
public class SignOutController extends AuthController {

    private final AuthService auth;
    private final AuthCookieFactory cookies;

    public SignOutController(AuthService auth, AuthCookieFactory cookies) {
        this.auth = auth;
        this.cookies = cookies;
    }

    @PostMapping("/sign-out")
    public ResponseEntity<ApiResponse<Void>> signOut(
            @CookieValue(name = AuthCookieFactory.REFRESH_COOKIE, required = false) String refresh) {

        auth.signOut(refresh);

        return withCookies(ok("Signed out."), cookies.clearAll());
    }
}
