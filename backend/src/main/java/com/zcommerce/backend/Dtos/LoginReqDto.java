package com.zcommerce.backend.Dtos;

import jakarta.validation.constraints.*;

public record LoginReqDto(

    @NotBlank 
    @Email
    String email,

    @NotBlank
    @Size(min = 8)
    String password

) implements BaseReqDto {}
