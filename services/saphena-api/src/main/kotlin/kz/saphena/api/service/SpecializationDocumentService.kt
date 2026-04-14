package kz.saphena.api.service

import jakarta.persistence.EntityExistsException
import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.dto.spec_doc.CreateSpecializationDocumentRequest
import kz.saphena.api.dto.spec_doc.SpecializationDocumentResponse
import kz.saphena.api.dto.spec_doc.toSpecDocResponse
import kz.saphena.api.model.spec_doc.SpecializationDocument
import kz.saphena.api.repository.spec_doc.SpecializationDocumentRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.util.*

@Service
class SpecializationDocumentService(
    private val specializationDocumentRepository: SpecializationDocumentRepository
) {

    fun getSpecializationDocuments(specializationId: UUID): List<SpecializationDocumentResponse> {
        return specializationDocumentRepository.findAllBySpecializationId(specializationId)
            .map { it.toSpecDocResponse() }
    }

    fun createSpecializationDocument(
        specializationId: UUID,
        request: CreateSpecializationDocumentRequest
    ) {
        if (specializationDocumentRepository.existsBySpecializationIdAndName(specializationId, request.name)) {
            throw EntityExistsException("Specialization Document already exists")
        }

        specializationDocumentRepository.save(
            SpecializationDocument(
                specializationId = specializationId,
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

    fun getSpecializationDocument(id: UUID): SpecializationDocumentResponse {
        return specializationDocumentRepository.findByIdOrNull(id)
            ?.toSpecDocResponse()
            ?: throw EntityNotFoundException("Specialization Document Not Found")
    }

    fun updateSpecializationDocument(
        id: UUID,
        request: CreateSpecializationDocumentRequest
    ) {
        val document = specializationDocumentRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Specialization Document Not Found")

        specializationDocumentRepository.save(
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

    fun deleteSpecializationDocument(id: UUID) {
        specializationDocumentRepository.deleteById(id)
    }

    fun restoreSpecializationDocument(id: UUID) {
        val specializationDocument = specializationDocumentRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Specialization Document Not Found")

        specializationDocumentRepository.save(
            specializationDocument.also {
                it.restore()
            }
        )
    }

    fun getSpecDocCatalog(specializationId: UUID): List<SpecializationDocumentResponse> {
        return specializationDocumentRepository.findActiveSpecDocs(specializationId)
            .map { it.toSpecDocResponse() }
    }

}