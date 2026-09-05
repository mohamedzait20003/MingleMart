package com.minglemart.shared.common;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(String message, T data, String error) {

    public static <T> ApiResponse<T> of(String message, T data) {
        return new ApiResponse<>(message, data, null);
    }

    public static <T> ApiResponse<T> of(String message) {
        return new ApiResponse<>(message, null, null);
    }

    public static <T> ApiResponse<T> failed(String message, String error) {
        return new ApiResponse<>(message, null, error);
    }
}
