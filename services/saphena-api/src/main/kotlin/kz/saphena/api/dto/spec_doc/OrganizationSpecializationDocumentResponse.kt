package kz.saphena.api.dto.spec_doc

import kz.saphena.api.model.spec_doc.OrganizationSpecializationDocument
import java.util.*

data class OrganizationSpecializationDocumentResponse(
    val id: UUID,
    val specDoc: SpecializationDocumentResponse,
    val deleted: Boolean,
    val modified: Boolean?,
)

fun OrganizationSpecializationDocument.toOrgSpecDocResponse(modified: Boolean?) = OrganizationSpecializationDocumentResponse(
    id = getIdSafely(),
    specDoc = specializationDocument.toSpecDocResponse(),
    deleted = deleted,
    modified = modified
)
