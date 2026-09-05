package com.minglemart.modules.identity.controllers;

import com.minglemart.shared.common.ApiResponse;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minglemart.modules.identity.dtos.AuthenticatedUser;
import com.minglemart.modules.identity.dtos.SignInRequest;
import com.minglemart.modules.identity.factories.AuthCookieFactory;
import com.minglemart.modules.identity.services.AuthService;

/**
 * POST /api/auth/sign-in
 *
 * <p>An unverified account is refused with EMAIL_NOT_VERIFIED and a fresh
 * verification link is issued — handled inside {@link AuthService#signIn}.
 */
@RestController
@RequestMapping("/api/auth")
public class SignInController extends AuthController {

    private final AuthService auth;
    private final AuthCookieFactory cookies;

    public SignInController(AuthService auth, AuthCookieFactory cookies) {
        this.auth = auth;
        this.cookies = cookies;
    }

    @PostMapping("/sign-in")
    public ResponseEntity<ApiResponse<AuthenticatedUser>> signIn(
            @Valid @RequestBody SignInRequest request, HttpServletRequest http) {

        AuthService.Established established = auth.signIn(request, http);

        return withCookies(
                ok("Signed in.", AuthenticatedUser.from(established.user(), established.publicUserId())),
                cookies.access(established.accessToken()),
                cookies.refresh(established.refreshToken()),
                cookies.session(established.user(), established.publicUserId()));
    }
}
