package kz.saphena.api.dto.user

import jakarta.validation.constraints.NotBlank

data class UpdateUserRequest(
    @get:NotBlank
    val password: String
)
