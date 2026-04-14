package kz.saphena.api.dto.spec_doc

import jakarta.validation.constraints.NotBlank

data class CreateSpecializationDocumentRequest(
    @get:NotBlank
    val name: String,
    val nameKk: String?,
    val nameEn: String?
)
