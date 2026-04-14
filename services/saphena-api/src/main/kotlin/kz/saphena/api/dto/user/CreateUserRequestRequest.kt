package kz.saphena.api.dto.user

import jakarta.validation.constraints.NotBlank

data class CreateUserRequestRequest(
    @get:NotBlank
    val username: String,
    @get:NotBlank
    val password: String
)
