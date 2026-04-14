package kz.saphena.api.dto.specialization

import jakarta.validation.constraints.NotBlank

data class CreateSpecializationRequest(
    @get:NotBlank
    val name: String
)
