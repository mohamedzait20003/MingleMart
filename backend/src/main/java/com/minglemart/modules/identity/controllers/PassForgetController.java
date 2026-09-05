package com.minglemart.modules.identity.controllers;

import com.minglemart.shared.common.ApiResponse;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minglemart.modules.identity.dtos.PassForgetRequest;
import com.minglemart.modules.identity.services.AuthService;

/**
 * POST /api/auth/password-forget
 *
 * <p>Always answers the same way, whether or not the address exists. Confirming
 * which emails have accounts would make this an enumeration oracle.
 */
@RestController
@RequestMapping("/api/auth")
public class PassForgetController extends AuthController {

    private final AuthService auth;

    public PassForgetController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/password-forget")
    public ResponseEntity<ApiResponse<Void>> forgot(@Valid @RequestBody PassForgetRequest request) {

        // Queues the reset email when the address exists; silent when it does not.
        auth.requestPasswordReset(request.email());

        return ok("If that email has an account, a reset link is on its way.");
    }
}
