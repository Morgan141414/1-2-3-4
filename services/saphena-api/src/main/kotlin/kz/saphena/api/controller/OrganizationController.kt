package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.user.CreateUserRequestRequest
import kz.saphena.api.dto.organization.CreateOrganizationRequest
import kz.saphena.api.model.user.UserRoleType
import kz.saphena.api.service.OrganizationService
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/organizations")
class OrganizationController(
    private val organizationService: OrganizationService
) {
    private val logger = LoggerFactory.getLogger(OrganizationController::class.java)

    @GetMapping
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun getOrganizations(
        @PageableDefault(sort = ["clinicName"])
        pageable: Pageable
    ) = run {
        logger.info("Fetching organizations page={} size={} sort={}", pageable.pageNumber, pageable.pageSize, pageable.sort)
        organizationService.getOrganizations(pageable)
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun createOrganization(
        @RequestBody @Valid
        request: CreateOrganizationRequest
    ) = run {
        logger.info("Creating organization clinicName='{}', organizationName='{}'", request.clinicName, request.organizationName)
        organizationService.createOrganization(request)
    }

    @GetMapping("{id}")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun getOrganization(
        @PathVariable id: UUID
    ) = run {
        logger.info("Fetching organization id={}", id)
        organizationService.getOrganization(id)
    }

    @PutMapping("{id}")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun updateOrganization(
        @PathVariable id: UUID,
        @RequestBody @Valid
        request: CreateOrganizationRequest
    ) = run {
        logger.info("Updating organization id={}, clinicName='{}', organizationName='{}'", id, request.clinicName, request.organizationName)
        organizationService.updateOrganization(id, request)
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun deleteOrganization(
        @PathVariable id: UUID
    ) = run {
        logger.info("Deleting organization id={}", id)
        organizationService.deleteOrganization(id)
    }

    @GetMapping("by-ids")
    fun getOrganizationsByIds(
        @RequestParam ids: List<UUID>
    ) = run {
        logger.info("Fetching organizations by ids count={}", ids.size)
        organizationService.getOrganizationsByIds(ids)
    }

    @GetMapping("{id}/ceos")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun getOrganizationCEOs(
        @PathVariable id: UUID
    ) = run {
        logger.info("Fetching organization CEOs orgId={}", id)
        organizationService.getOrganizationUsers(id, UserRoleType.CEO)
    }

    @PostMapping("{id}/ceos")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun addOrganizationCEO(
        @PathVariable id: UUID,
        @RequestBody @Valid
        request: CreateUserRequestRequest
    ) = run {
        logger.info("Adding CEO to organization orgId={}, username='{}'", id, request.username)
        organizationService.addOrganizationUser(id, UserRoleType.CEO, request)
    }

    @GetMapping("{id}/admins")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun getOrganizationAdmins(
        @PathVariable id: UUID
    ) = run {
        logger.info("Fetching organization admins orgId={}", id)
        organizationService.getOrganizationUsers(id, UserRoleType.ORGANIZATION_ADMIN)
    }

    @PostMapping("{id}/admins")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun addOrganizationAdmin(
        @PathVariable id: UUID,
        @RequestBody @Valid
        request: CreateUserRequestRequest
    ) = run {
        logger.info("Adding admin to organization orgId={}, username='{}'", id, request.username)
        organizationService.addOrganizationUser(id, UserRoleType.ORGANIZATION_ADMIN, request)
    }

    @GetMapping("{id}/accountants")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun getOrganizationAccountants(
        @PathVariable id: UUID
    ) = run {
        logger.info("Fetching organization accountants orgId={}", id)
        organizationService.getOrganizationUsers(id, UserRoleType.ACCOUNTANT)
    }

    @PostMapping("{id}/accountants")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun addOrganizationAccountant(
        @PathVariable id: UUID,
        @RequestBody @Valid
        request: CreateUserRequestRequest
    ) = run {
        logger.info("Adding accountant to organization orgId={}, username='{}'", id, request.username)
        organizationService.addOrganizationUser(id, UserRoleType.ACCOUNTANT, request)
    }

    @GetMapping("operators")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun getOrganizationOperators() = run {
        logger.info("Fetching organization operators for current organization context")
        organizationService.getOrganizationUsers(null, UserRoleType.OPERATOR)
    }

    @PostMapping("operators")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun addOrganizationOperator(
        @RequestBody @Valid
        request: CreateUserRequestRequest
    ) = run {
        logger.info("Adding operator to current organization context, username='{}'", request.username)
        organizationService.addOrganizationUser(null, UserRoleType.OPERATOR, request)
    }

    @GetMapping("receptionists")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun getOrganizationReceptionists() = run {
        logger.info("Fetching organization receptionists for current organization context")
        organizationService.getOrganizationUsers(null, UserRoleType.RECEPTIONIST)
    }

    @PostMapping("receptionists")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun addOrganizationReceptionist(
        @RequestBody @Valid
        request: CreateUserRequestRequest
    ) = run {
        logger.info("Adding receptionist to current organization context, username='{}'", request.username)
        organizationService.addOrganizationUser(null, UserRoleType.RECEPTIONIST, request)
    }

    @DeleteMapping("users/{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_SUPERADMIN', 'ROLE_ORGANIZATION_ADMIN')")
    fun removeOrganizationUser(
        @PathVariable id: UUID
    ) = run {
        logger.info("Removing organization user id={}", id)
        organizationService.removeOrganizationUser(id)
    }

    @GetMapping("bin/{bin}")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun checkOrganizationExistByBin(
        @PathVariable bin: String
    ) = organizationService.checkOrganizationExistByBin(bin)

}
