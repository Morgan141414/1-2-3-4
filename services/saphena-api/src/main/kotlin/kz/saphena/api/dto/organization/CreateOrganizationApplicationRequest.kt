package kz.saphena.api.dto.organization

import jakarta.validation.constraints.NotBlank

data class CreateOrganizationApplicationRequest(
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
    @get:NotBlank
    val applicantFullName: String,
    @get:NotBlank
    val applicantIin: String,
    val comment: String? = null,
)
