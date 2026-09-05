package com.minglemart.modules.identity.controllers;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minglemart.modules.identity.dtos.AuthenticatedUser;
import com.minglemart.modules.identity.dtos.SessionHandleRequest;
import com.minglemart.modules.identity.services.AuthService;
import com.minglemart.shared.common.ApiResponse;
import com.minglemart.shared.common.AuthCookies;

/**
 * POST /api/auth/session
 *
 * <p>What the frontend server calls on a full page reload, before rendering
 * anything. The browser has cookies but the SSR process has no in-memory state,
 * so this is how it learns who it is rendering for.
 *
 * <p>Two things must line up: the {@code refresh} cookie identifies the session
 * row, and the proof must decrypt — with that row's private key — to the handle
 * whose digest the row stores. Holding one without the other fails, which is
 * what stops a copied URL or a stale proof from standing in for a session.
 */
@RestController
@RequestMapping("/api/auth")
public class SessionController extends AuthController {

    private final AuthService auth;

    public SessionController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/session")
    public ResponseEntity<ApiResponse<AuthenticatedUser>> current(
            @CookieValue(name = AuthCookies.REFRESH, required = false) String refresh,
            @Valid @RequestBody SessionHandleRequest request) {

        var verified = auth.verifySession(refresh, request.publicUserId());

        return ok("Session verified.",
                AuthenticatedUser.from(verified.user(), verified.publicUserId()));
    }
}
