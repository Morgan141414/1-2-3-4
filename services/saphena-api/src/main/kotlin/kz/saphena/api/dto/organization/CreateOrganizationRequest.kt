package kz.saphena.api.dto.organization

import jakarta.validation.constraints.NotBlank

data class CreateOrganizationRequest(
    @get:NotBlank
    val clinicName: String,
    @get:NotBlank
    val organizationName: String,
    @get:NotBlank
    val address: String,
    @get:NotBlank
    val phone: String,
    @get:NotBlank
    val email: String,
    @get:NotBlank
    val bin: String,
)
