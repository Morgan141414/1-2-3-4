package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.assistant.CreateAssistantRequest
import kz.saphena.api.dto.assistant.UpdateAssistantRequest
import kz.saphena.api.model.assistant.AssistantType
import kz.saphena.api.service.AssistantService
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/assistants")
class AssistantController(
    private val assistantService: AssistantService
) {

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_DOCTOR')")
    fun getAssistants(
        @RequestParam type: AssistantType?,
        @PageableDefault(sort = ["lastName"])
        pageable: Pageable
    ) = assistantService.getAssistants(type, pageable)

    @GetMapping("{id}")
    fun getAssistant(
        @PathVariable id: UUID
    ) = assistantService.getAssistant(id)

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun createAssistant(
        @RequestBody @Valid
        request: CreateAssistantRequest
    ) = assistantService.createAssistant(request)

    @PutMapping("{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun updateAssistant(
        @PathVariable id: UUID,
        @RequestBody @Valid
        request: UpdateAssistantRequest
    ) = assistantService.updateAssistant(id, request)

    @GetMapping("list")
    fun getAssistantList(
        @RequestParam(required = true) type: AssistantType
    ) = assistantService.getAssistantList(type)

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun deleteAssistant(
        @PathVariable id: UUID
    ) = assistantService.deleteAssistant(id)

    @PostMapping("{id}/activate")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun activateAssistant(
        @PathVariable id: UUID
    ) = assistantService.activateAssistant(id)
}