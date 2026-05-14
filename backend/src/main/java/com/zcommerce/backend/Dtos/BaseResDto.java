package com.zcommerce.backend.Dtos;

public sealed interface BaseResDto extends BaseDto permits BaseResDto.Default, LoginResDto {
    String message();

    record Default(String message) implements BaseResDto {}

    static BaseResDto of(String message) {
        return new Default(message);
    }
}
