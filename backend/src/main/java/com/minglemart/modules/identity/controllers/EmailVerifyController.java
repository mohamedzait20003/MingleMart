package com.minglemart.modules.identity.controllers;

import com.minglemart.shared.common.ApiResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minglemart.modules.identity.models.UserModel;
import com.minglemart.modules.identity.services.AuthService;
import com.minglemart.modules.identity.dtos.AuthenticatedUser;

@RestController
@RequestMapping("/api/auth")
public class EmailVerifyController extends AuthController {

    private final AuthService auth;

    public EmailVerifyController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/email-verify")
    public ResponseEntity<ApiResponse<AuthenticatedUser>> verify(@RequestParam String token) {
        UserModel user = auth.verifyEmail(token);

        return ok("Email verified. You can sign in now.", AuthenticatedUser.from(user));
    }
}
