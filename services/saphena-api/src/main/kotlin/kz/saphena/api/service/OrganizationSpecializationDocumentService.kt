package kz.saphena.api.service

import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.dto.spec_doc.OrganizationSpecializationDocumentResponse
import kz.saphena.api.dto.spec_doc.SyncOrgSpecDocsRequest
import kz.saphena.api.dto.spec_doc.toOrgSpecDocResponse
import kz.saphena.api.model.protocol.ProtocolTargetType
import kz.saphena.api.model.spec_doc.OrganizationSpecializationDocument
import kz.saphena.api.repository.protocol.ProtocolRepository
import kz.saphena.api.repository.spec_doc.OrganizationSpecializationDocumentRepository
import kz.saphena.api.repository.spec_doc.SpecializationDocumentRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.util.*

@Service
class OrganizationSpecializationDocumentService(
    private val orgSpecDocRepository: OrganizationSpecializationDocumentRepository,
    private val specializationDocumentRepository: SpecializationDocumentRepository,
    private val protocolRepository: ProtocolRepository,
) {

    fun getOrgSpecDocs(specializationId: UUID): List<OrganizationSpecializationDocumentResponse> {
        val organizationId = OrganizationContext.getCurrentOrganizationId()

        return orgSpecDocRepository.findAllByOrganizationIdAndSpecializationId(
            organizationId = organizationId,
            specializationId = specializationId,
        )
            .map { it.toOrgSpecDocResponse(null) }
    }

    fun syncOrganizationSpecDocs(specializationId: UUID,
                                 request: SyncOrgSpecDocsRequest) {
        val organizationId = OrganizationContext.getCurrentOrganizationId()

        val requestIds = request.specDocIds.toSet()

        val existing = orgSpecDocRepository
            .findAllByOrganizationIdAndSpecializationId(
                specializationId = specializationId,
                organizationId = organizationId
            )

        val existingBySpecDocId = existing
            .associateBy { it.specializationDocument.id }

        requestIds.forEach { specDocId ->
            val osd = existingBySpecDocId[specDocId]

            when {
                osd == null -> {
                    orgSpecDocRepository.save(
                        OrganizationSpecializationDocument(
                            organizationId = organizationId,
                            specializationDocument = specializationDocumentRepository.getReferenceById(specDocId),
                        )
                    )
                }
                osd.deleted -> {
                    orgSpecDocRepository.save(
                        osd.apply { restore() }
                    )
                }
            }
        }

        existing
            .filter { it.specializationDocument.id !in requestIds && !it.deleted }
            .forEach { orgSpecDocRepository.delete(it) }
    }

    fun disableOrgSpecDoc(id: UUID) {
        orgSpecDocRepository.deleteById(id)
    }

    fun restoreOrgSpecDoc(id: UUID) {
        val orgSpecDoc = orgSpecDocRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Organization SpecDoc with id $id not found")

        orgSpecDocRepository.save(
            orgSpecDoc.also {
                it.restore()
            }
        )
    }

    fun getActiveOrgSpecDocs(specializationId: UUID): List<OrganizationSpecializationDocumentResponse> {
        val organizationId = OrganizationContext.getCurrentOrganizationId()

        val modifiedIds = protocolRepository
            .findAllModifiedTargetIds(
                targetType = ProtocolTargetType.SPEC_DOC,
                organizationId = organizationId,
            )

        return orgSpecDocRepository.findActiveOrganizationSpecializationDocuments(
            organizationId = organizationId,
            specializationId = specializationId,
        )
            .map {
                it.toOrgSpecDocResponse(
                    modified = modifiedIds.contains(it.specializationDocument.id)
                )
            }
    }

}