package com.minglemart.modules.identity.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PassResetRequest(
    @NotBlank String token,
    @NotBlank @Size(min = 6, max = 100) String password,
    @NotBlank String passwordConfirmation
) {

    public boolean passwordsMatch() {
        return password.equals(passwordConfirmation);
    }
}
