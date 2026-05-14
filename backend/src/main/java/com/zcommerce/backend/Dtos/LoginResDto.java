package com.zcommerce.backend.Dtos;

public record LoginResDto(
    String message,
    String token,
    UserData user
) implements BaseResDto {

    public record UserData(
        String username,
        String email
    ) {}
}
