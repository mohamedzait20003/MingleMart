package com.minglemart.modules.identity.controllers;

import com.minglemart.shared.common.ApiResponse;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minglemart.modules.identity.dtos.AuthenticatedUser;
import com.minglemart.modules.identity.dtos.SignUpRequest;
import com.minglemart.modules.identity.models.UserModel;
import com.minglemart.modules.identity.services.AuthService;

/**
 * POST /api/auth/sign-up
 *
 * <p>Rejects an existing email or username with 409. On success the account is
 * created unverified and a verification link is issued — no session is opened,
 * so the user must follow the link before they can sign in.
 */
@RestController
@RequestMapping("/api/auth")
public class SignUpController extends AuthController {

    private final AuthService auth;

    public SignUpController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/sign-up")
    public ResponseEntity<ApiResponse<AuthenticatedUser>> signUp(
            @Valid @RequestBody SignUpRequest request) {

        // signUp() already issues the verification token and queues its email.
        UserModel user = auth.signUp(request);

        return created(
                "Account created. Check your email to verify your address.",
                AuthenticatedUser.from(user),
                user.getId());
    }
}
