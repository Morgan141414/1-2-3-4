package kz.saphena.api.service

import kz.saphena.api.dto.field_template.CreateFieldTemplateRequest
import kz.saphena.api.dto.field_template.FieldTemplateResponse
import kz.saphena.api.dto.field_template.toResponse
import kz.saphena.api.model.field_template.FieldTemplate
import kz.saphena.api.repository.field_template.FieldTemplateRepository
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class FieldTemplateService(
    private val fieldTemplateRepository: FieldTemplateRepository,
    private val meService: MeService
) {

    fun getFieldTemplates(documentId: UUID,
                          fieldKey: String): List<FieldTemplateResponse> {
        val me = meService.me()

        return fieldTemplateRepository.findAllByUserIdAndDocumentIdAndFieldKey(
            me.getIdSafely(),
            documentId,
            fieldKey
        ).map { it.toResponse() }
    }

    fun createFieldTemplate(request: CreateFieldTemplateRequest) {
        val me = meService.me()

        fieldTemplateRepository.save(
            FieldTemplate(
                userId = me.getIdSafely(),
                documentId = request.documentId,
                fieldKey = request.fieldKey,
                name = request.name,
                content = request.content,
            )
        )
    }
}