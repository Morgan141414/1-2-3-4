package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.spec_doc.SyncOrgSpecDocsRequest
import kz.saphena.api.service.OrganizationSpecializationDocumentService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("/api/organization-spec-docs")
class OrganizationSpecializationDocumentController(
    private val orgSpecDocService: OrganizationSpecializationDocumentService
) {

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun getOrgSpecDocs(
        @RequestParam(required = true)
        specializationId: UUID,
    ) = orgSpecDocService.getOrgSpecDocs(specializationId)

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun disableOrgSpecDoc(
        @PathVariable
        id: UUID,
    ) = orgSpecDocService.disableOrgSpecDoc(id)

    @PatchMapping("{id}/restore")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun restoreOrgSpecDoc(
        @PathVariable id: UUID,
    ) = orgSpecDocService.restoreOrgSpecDoc(id)

    @PutMapping("sync")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun syncSpecDocsToOrganization(
        @RequestParam
        specializationId: UUID,
        @RequestBody @Valid
        request: SyncOrgSpecDocsRequest
    ) = orgSpecDocService.syncOrganizationSpecDocs(
        specializationId = specializationId,
        request = request
    )

    @GetMapping("catalog")
    fun getActiveOrgSpecDocs(
        @RequestParam(required = true)
        specializationId: UUID,
    ) = orgSpecDocService.getActiveOrgSpecDocs(specializationId)

}