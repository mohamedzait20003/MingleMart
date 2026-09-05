package com.minglemart.modules.identity.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record PassForgetRequest(@NotBlank @Email String email) {
}
