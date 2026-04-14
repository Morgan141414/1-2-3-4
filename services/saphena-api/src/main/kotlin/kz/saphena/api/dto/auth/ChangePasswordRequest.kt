package kz.saphena.api.dto.auth

import jakarta.validation.constraints.NotBlank

data class ChangePasswordRequest(
    @get:NotBlank
    val oldPassword: String,
    @get:NotBlank
    val newPassword: String,
)

