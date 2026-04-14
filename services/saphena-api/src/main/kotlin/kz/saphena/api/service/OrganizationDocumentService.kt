package kz.saphena.api.service

import jakarta.persistence.EntityExistsException
import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.dto.organization.CreateOrganizationDocumentRequest
import kz.saphena.api.dto.organization.OrganizationDocumentResponse
import kz.saphena.api.dto.organization.toOrgDocResponse
import kz.saphena.api.model.organization.OrganizationDocument
import kz.saphena.api.repository.organization.OrganizationDocumentRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.util.*

@Service
class OrganizationDocumentService(
    private val organizationDocumentRepository: OrganizationDocumentRepository,
) {

    fun getOrganizationDocuments(): List<OrganizationDocumentResponse> {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        return organizationDocumentRepository.findAllByOrganizationId(myOrgId)
            .map { it.toOrgDocResponse() }
    }

    fun createOrganizationDocument(request: CreateOrganizationDocumentRequest) {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        if (organizationDocumentRepository.existsByOrganizationIdAndName(myOrgId, request.name)) {
            throw EntityExistsException("Organization Document already exists")
        }

        organizationDocumentRepository.save(
            OrganizationDocument(
                organizationId = myOrgId,
                name = request.name.trim(),
                nameKk = request.nameKk
                    ?.trim()
                    ?.takeIf { it.isNotEmpty() },
                nameEn = request.nameEn
                    ?.trim()
                    ?.takeIf { it.isNotEmpty() }
            )
        )
    }

    fun getOrganizationDocument(id: UUID): OrganizationDocumentResponse {
        return organizationDocumentRepository.findByIdOrNull(id)?.toOrgDocResponse()
            ?: throw EntityNotFoundException("Organization Document Not Found")
    }

    fun updateOrganizationDocument(id: UUID,
                                   request: CreateOrganizationDocumentRequest
    ) {
        val document = organizationDocumentRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Organization Document Not Found")

        organizationDocumentRepository.save(
            document.also { d ->
                d.name = request.name.trim()
                d.nameKk = request.nameKk
                    ?.trim()
                    ?.takeIf { it.isNotEmpty() }
                d.nameEn = request.nameEn
                    ?.trim()
                    ?.takeIf { it.isNotEmpty() }
            }
        )
    }

    fun deleteOrganizationDocument(id: UUID) {
        organizationDocumentRepository.deleteById(id)
    }

    fun restoreOrganizationDocument(id: UUID) {
        val document = organizationDocumentRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Organization Document Not Found")

        organizationDocumentRepository.save(
            document.also {
                it.restore()
            }
        )
    }

    fun getOrgDocCatalog(): List<OrganizationDocumentResponse> {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        return organizationDocumentRepository.findActiveOrgDocs(myOrgId)
            .map { it.toOrgDocResponse() }
    }

}