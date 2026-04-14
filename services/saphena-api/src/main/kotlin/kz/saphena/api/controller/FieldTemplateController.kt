package kz.saphena.api.controller

import kz.saphena.api.dto.field_template.CreateFieldTemplateRequest
import kz.saphena.api.service.FieldTemplateService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/field-templates")
class FieldTemplateController(
    private val fieldTemplateService: FieldTemplateService
) {

    @GetMapping
    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    fun getFieldTemplates(
        @RequestParam
        documentId: UUID,
        @RequestParam
        fieldKey: String,
    ) = fieldTemplateService.getFieldTemplates(documentId, fieldKey)

    @PostMapping
    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    fun createFieldTemplate(
        @RequestBody
        request: CreateFieldTemplateRequest
    ) = fieldTemplateService.createFieldTemplate(request)

}