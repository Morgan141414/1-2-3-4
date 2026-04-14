package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.organization.CreateOrganizationDocumentRequest
import kz.saphena.api.service.OrganizationDocumentService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/organization-documents")
class OrganizationDocumentController(
    private val organizationDocumentService: OrganizationDocumentService
) {

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun getOrganizationDocuments() = organizationDocumentService.getOrganizationDocuments()

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun createOrganizationDocument(
        @RequestBody @Valid
        request: CreateOrganizationDocumentRequest,
    ) = organizationDocumentService.createOrganizationDocument(request)

    @GetMapping("{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_RECEPTIONIST')")
    fun getOrganizationDocument(
        @PathVariable id: UUID,
    ) = organizationDocumentService.getOrganizationDocument(id)

    @PutMapping("{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun createOrganizationDocument(
        @PathVariable id: UUID,
        @RequestBody @Valid
        request: CreateOrganizationDocumentRequest,
    ) = organizationDocumentService.updateOrganizationDocument(
        id,
        request,
    )

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun deleteOrganizationDocument(
        @PathVariable id: UUID,
    ) = organizationDocumentService.deleteOrganizationDocument(id)

    @PatchMapping("{id}/restore")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun restoreOrganizationDocument(
        @PathVariable id: UUID,
    ) = organizationDocumentService.restoreOrganizationDocument(id)

    @GetMapping("catalog")
    fun getOrgDocCatalog() = organizationDocumentService.getOrgDocCatalog()

}
