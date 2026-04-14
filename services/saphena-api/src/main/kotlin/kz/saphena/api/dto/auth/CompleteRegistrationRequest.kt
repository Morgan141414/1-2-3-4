package kz.saphena.api.dto.auth

import jakarta.validation.constraints.NotBlank

data class CompleteRegistrationRequest(
    @get:NotBlank
    val iin: String,
    @get:NotBlank
    val code: String,
    @get:NotBlank
    val password: String
)
