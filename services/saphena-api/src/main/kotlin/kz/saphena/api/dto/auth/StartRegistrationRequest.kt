package kz.saphena.api.dto.auth

import jakarta.validation.constraints.NotBlank

data class StartRegistrationRequest(
    @get:NotBlank
    val iin: String
)
