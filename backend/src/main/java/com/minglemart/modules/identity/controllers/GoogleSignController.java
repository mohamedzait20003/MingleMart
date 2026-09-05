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
import com.minglemart.modules.identity.dtos.GoogleSignRequest;
import com.minglemart.modules.identity.factories.AuthCookieFactory;
import com.minglemart.modules.identity.services.AuthService;
import com.minglemart.modules.identity.services.GoogleService;

/**
 * POST /api/auth/google
 *
 * <p>One endpoint for both sign-in and sign-up: an existing email signs in, an
 * unknown one creates the account. That is the opposite of
 * {@link SignUpController}, which treats an existing email as a conflict —
 * correct in both cases, because Google has already proven the address belongs
 * to the caller.
 *
 * <p>Accounts created here start verified and skip the email round trip.
 */
@RestController
@RequestMapping("/api/auth")
public class GoogleSignController extends AuthController {

    private final AuthService auth;
    private final GoogleService google;
    private final AuthCookieFactory cookies;

    public GoogleSignController(AuthService auth, GoogleService google, AuthCookieFactory cookies) {
        this.auth = auth;
        this.google = google;
        this.cookies = cookies;
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthenticatedUser>> google(
            @Valid @RequestBody GoogleSignRequest request, HttpServletRequest http) {

        GoogleService.OAuthProfile profile = google.verify(request.idToken());

        AuthService.Established established = auth.googleSignIn(profile, http);

        return withCookies(
                ok("Signed in with Google.", AuthenticatedUser.from(established.user(), established.publicUserId())),
                cookies.access(established.accessToken()),
                cookies.refresh(established.refreshToken()),
                cookies.session(established.user(), established.publicUserId()));
    }
}
