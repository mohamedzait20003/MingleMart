package com.minglemart.modules.identity.controllers;

import com.minglemart.shared.common.ApiResponse;


import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minglemart.modules.identity.dtos.AuthenticatedUser;
import com.minglemart.modules.identity.dtos.PassResetRequest;
import com.minglemart.modules.identity.models.UserModel;
import com.minglemart.modules.identity.factories.AuthCookieFactory;
import com.minglemart.modules.identity.services.AuthService;

/**
 * POST /api/auth/password-reset
 *
 * <p>Consumes the reset token, sets the new password and revokes every existing
 * session — a password change should end sessions the previous holder had.
 * The caller signs in again afterwards, so no cookies are issued here.
 */
@RestController
@RequestMapping("/api/auth")
public class PassResetController extends AuthController {

    private final AuthService auth;
    private final AuthCookieFactory cookies;

    public PassResetController(AuthService auth, AuthCookieFactory cookies) {
        this.auth = auth;
        this.cookies = cookies;
    }

    @PostMapping("/password-reset")
    public ResponseEntity<ApiResponse<AuthenticatedUser>> reset(
            @Valid @RequestBody PassResetRequest request) {

        if (!request.passwordsMatch()) {
            return failure(HttpStatus.BAD_REQUEST,
                    "Passwords do not match.", "PASSWORD_MISMATCH");
        }

        UserModel user = auth.resetPassword(request.token(), request.password());

        return withCookies(
                ok("Password updated. Please sign in again.", AuthenticatedUser.from(user)),
                cookies.clearAll());
    }
}
