package kz.saphena.api.dto.spec_doc

import kz.saphena.api.model.spec_doc.SpecializationDocument
import java.util.*

data class SpecializationDocumentResponse(
    val id: UUID,
    val name: String,
    val nameKk: String?,
    val nameEn: String?,
    val deleted: Boolean,
)

fun SpecializationDocument.toSpecDocResponse() = SpecializationDocumentResponse(
    id = getIdSafely(),
    name = name,
    nameKk = nameKk,
    nameEn = nameEn,
    deleted = deleted,
)