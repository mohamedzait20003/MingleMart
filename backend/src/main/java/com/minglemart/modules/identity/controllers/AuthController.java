package com.minglemart.modules.identity.controllers;

import com.minglemart.shared.common.ApiResponse;


import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.minglemart.modules.identity.common.AuthException;
import com.minglemart.shared.domain.BaseController;

abstract class AuthController extends BaseController {

    @ExceptionHandler(AuthException.class)
    ResponseEntity<ApiResponse<Void>> handleAuth(AuthException e) {
        return failure(e.status(), e.getMessage(), e.code());
    }

    /** Adds Set-Cookie headers to a response without disturbing its body. */
    protected <T> ResponseEntity<ApiResponse<T>> withCookies(ResponseEntity<ApiResponse<T>> response, ResponseCookie... cookies) {
        ResponseEntity.BodyBuilder builder = ResponseEntity.status(response.getStatusCode());
        response.getHeaders().forEach((name, values) -> values.forEach(v -> builder.header(name, v)));

        for (ResponseCookie cookie : cookies) {
            builder.header("Set-Cookie", cookie.toString());
        }

        return builder.body(response.getBody());
    }
}
