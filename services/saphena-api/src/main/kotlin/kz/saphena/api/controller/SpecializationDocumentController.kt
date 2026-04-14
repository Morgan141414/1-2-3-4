package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.spec_doc.CreateSpecializationDocumentRequest
import kz.saphena.api.service.SpecializationDocumentService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/specialization-documents")
class SpecializationDocumentController(
    private val specializationDocumentService: SpecializationDocumentService
) {

    @GetMapping
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun getSpecializationDocuments(
        @RequestParam(required = true) specializationId: UUID,
    ) = specializationDocumentService.getSpecializationDocuments(specializationId)

    @PostMapping
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun createSpecializationDocument(
        @RequestParam(required = true) specializationId: UUID,
        @RequestBody @Valid
        request: CreateSpecializationDocumentRequest
    ) = specializationDocumentService.createSpecializationDocument(specializationId, request)

    @GetMapping("{id}")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun getSpecializationDocument(
        @PathVariable id: UUID
    ) = specializationDocumentService.getSpecializationDocument(id)

    @PutMapping("{id}")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun updateSpecializationDocument(
        @PathVariable id: UUID,
        @RequestBody @Valid
        request: CreateSpecializationDocumentRequest
    ) = specializationDocumentService.updateSpecializationDocument(id, request)

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun deleteSpecializationDocument(
        @PathVariable id: UUID
    ) = specializationDocumentService.deleteSpecializationDocument(id)

    @PatchMapping("{id}/restore")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun restoreSpecializationDocument(
        @PathVariable id: UUID
    ) = specializationDocumentService.restoreSpecializationDocument(id)

    @GetMapping("catalog")
    fun getSpecDocCatalog(
        @RequestParam(required = true) specializationId: UUID,
    ) = specializationDocumentService.getSpecDocCatalog(specializationId)

}