package com.minglemart.modules.identity.dtos;

import jakarta.validation.constraints.NotBlank;

/** What the frontend server posts on reload, before rendering anything. */
public record SessionHandleRequest(@NotBlank String publicUserId) {
}
