package kz.saphena.api.dto.organization

import jakarta.validation.constraints.NotBlank

data class CreateOrganizationDocumentRequest(
    @get:NotBlank
    val name: String,
    val nameKk: String?,
    val nameEn: String?
)
