package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.procedure.SyncOrgProceduresRequest
import kz.saphena.api.dto.procedure.UpdateOrganizationProcedureRequest
import kz.saphena.api.service.OrganizationProcedureService
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
import java.util.UUID

@RestController
@RequestMapping("/api/organization-procedures")
class OrganizationProcedureController(
    private val organizationProcedureService: OrganizationProcedureService,
) {

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun getOrganizationProcedures(
        @RequestParam(required = true)
        specializationId: UUID,
    ) = organizationProcedureService.getOrganizationProcedures(specializationId)

    @GetMapping("{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun getOrganizationProcedure(
        @PathVariable
        id: UUID,
    ) = organizationProcedureService.getOrganizationProcedure(id)

    @PatchMapping("{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun updateOrganizationProcedure(
        @PathVariable
        id: UUID,
        @RequestBody @Valid
        request: UpdateOrganizationProcedureRequest
    ) = organizationProcedureService.updateOrganizationProcedure(
        id = id,
        request = request
    )

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun disableOrganizationProcedure(
        @PathVariable
        id: UUID,
    ) = organizationProcedureService.disableOrganizationProcedure(id)

    @PatchMapping("{id}/restore")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun restoreOrganizationProcedure(
        @PathVariable id: UUID,
    ) = organizationProcedureService.restoreOrganizationProcedure(id)

    @PutMapping("sync")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun syncOrganizationProcedures(
        @RequestParam
        specializationId: UUID,
        @RequestBody @Valid
        request: SyncOrgProceduresRequest
    ) = organizationProcedureService.syncOrganizationProcedures(
        specializationId = specializationId,
        request = request
    )

    @GetMapping("catalog")
    fun getActiveOrganizationProcedures(
        @RequestParam(required = true)
        specializationId: UUID,
    ) = organizationProcedureService.getActiveOrganizationProcedures(specializationId)

    @GetMapping("specializations")
    fun getSpecializations() = organizationProcedureService.getSpecializations()

}
