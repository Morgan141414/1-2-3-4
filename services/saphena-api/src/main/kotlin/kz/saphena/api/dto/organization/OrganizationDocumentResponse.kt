package kz.saphena.api.dto.organization

import kz.saphena.api.model.organization.OrganizationDocument
import java.util.*

data class OrganizationDocumentResponse(
    val id: UUID,
    val name: String,
    val nameKk: String?,
    val nameEn: String?,
    val deleted: Boolean,
)

fun OrganizationDocument.toOrgDocResponse() = OrganizationDocumentResponse(
    id = getIdSafely(),
    name = name,
    nameKk = nameKk,
    nameEn = nameEn,
    deleted = deleted,
)