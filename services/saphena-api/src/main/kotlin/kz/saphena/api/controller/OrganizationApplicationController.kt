package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.organization.CreateOrganizationApplicationRequest
import kz.saphena.api.dto.organization.ModerateOrganizationApplicationRequest
import kz.saphena.api.service.OrganizationApplicationService
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/organization-applications")
class OrganizationApplicationController(
    private val organizationApplicationService: OrganizationApplicationService
) {
    private val logger = LoggerFactory.getLogger(OrganizationApplicationController::class.java)

    @PostMapping
    fun createOrganizationApplication(
        @RequestBody @Valid
        request: CreateOrganizationApplicationRequest
    ) = run {
        logger.info(
            "Creating organization application clinicName='{}', organizationName='{}'",
            request.clinicName,
            request.organizationName
        )
        organizationApplicationService.createApplication(request)
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun getOrganizationApplications(
        @PageableDefault(sort = ["createdAt"])
        pageable: Pageable
    ) = run {
        logger.info(
            "Fetching organization applications page={} size={} sort={}",
            pageable.pageNumber,
            pageable.pageSize,
            pageable.sort
        )
        organizationApplicationService.getApplications(pageable)
    }

    @GetMapping("{id}")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun getOrganizationApplication(
        @PathVariable id: UUID
    ) = run {
        logger.info("Fetching organization application id={}", id)
        organizationApplicationService.getApplication(id)
    }

    @PatchMapping("{id}")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun moderateOrganizationApplication(
        @PathVariable id: UUID,
        @RequestBody @Valid
        request: ModerateOrganizationApplicationRequest
    ) = run {
        logger.info("Moderating organization application id={} status={}", id, request.status)
        organizationApplicationService.moderateApplication(id, request)
    }
}
