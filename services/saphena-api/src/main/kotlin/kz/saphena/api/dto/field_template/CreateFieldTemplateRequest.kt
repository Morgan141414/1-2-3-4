package kz.saphena.api.dto.field_template

import java.util.UUID

data class CreateFieldTemplateRequest(
    val documentId: UUID,
    val fieldKey: String,
    val name: String,
    val content: String,
)
