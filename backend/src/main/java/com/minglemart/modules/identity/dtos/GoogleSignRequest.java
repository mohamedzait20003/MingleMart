package com.minglemart.modules.identity.dtos;

import jakarta.validation.constraints.NotBlank;

public record GoogleSignRequest(@NotBlank String idToken) {
}
