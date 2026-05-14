package com.zcommerce.backend.Dtos;

import jakarta.validation.constraints.*;

public record RegisterReqDto(

    @NotBlank 
    @Size(min = 3, max = 50)
    String username,

    @NotBlank 
    @Size(max = 50)
    String firstName,

    @NotBlank 
    @Size(max = 50)
    String lastName,

    @NotBlank 
    @Email
    String email,

    @NotBlank 
    @Size(min = 8)
    String password

) implements BaseReqDto {}
