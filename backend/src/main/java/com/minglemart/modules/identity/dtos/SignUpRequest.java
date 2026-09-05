package com.minglemart.modules.identity.dtos;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import com.minglemart.shared.enums.Gender;

public record SignUpRequest(
        @NotBlank @Size(min = 2, max = 100) String fname,
        @NotBlank @Size(min = 2, max = 100) String lname,
        @NotBlank @Size(min = 3, max = 50) String username,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6, max = 100) String password,
        Gender gender,
        LocalDate dateOfBirth
) {}
