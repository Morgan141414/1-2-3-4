package kz.saphena.api.dto.auth

import jakarta.validation.constraints.NotBlank

data class SignInRequest(
    @get:NotBlank
    val username: String,
    @get:NotBlank
    val password: String
)
