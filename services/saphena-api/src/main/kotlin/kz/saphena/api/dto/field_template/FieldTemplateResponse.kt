package kz.saphena.api.dto.field_template

import kz.saphena.api.model.field_template.FieldTemplate
import java.util.UUID

data class FieldTemplateResponse(
    val id: UUID,
    val name: String,
    val content: String,
)

fun FieldTemplate.toResponse() = FieldTemplateResponse(
    id = id,
    name = name,
    content = content,
)