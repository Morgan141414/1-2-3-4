package kz.saphena.api.service

import jakarta.persistence.EntityExistsException
import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.dto.PageResponse
import kz.saphena.api.dto.organization.CreateOrganizationApplicationRequest
import kz.saphena.api.dto.organization.CreateOrganizationRequest
import kz.saphena.api.dto.organization.ModerateOrganizationApplicationRequest
import kz.saphena.api.dto.organization.OrganizationApplicationResponse
import kz.saphena.api.dto.organization.toOrganizationApplicationResponse
import kz.saphena.api.model.organization.OrganizationApplication
import kz.saphena.api.model.organization.OrganizationApplicationStatus
import kz.saphena.api.repository.organization.OrganizationApplicationRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.UUID

@Service
class OrganizationApplicationService(
    private val organizationApplicationRepository: OrganizationApplicationRepository,
    private val organizationService: OrganizationService,
) {
    private val logger = LoggerFactory.getLogger(OrganizationApplicationService::class.java)

    fun getApplications(pageable: Pageable): PageResponse<OrganizationApplicationResponse> {
        logger.info(
            "Service: Fetching organization applications page={} size={} sort={}",
            pageable.pageNumber,
            pageable.pageSize,
            pageable.sort
        )
        return organizationApplicationRepository.findApplications(pageable)
            .map { it.toOrganizationApplicationResponse() }
            .let {
                PageResponse(
                    content = it.content,
                    totalPages = it.totalPages,
                    number = it.number,
                    last = it.isLast
                )
            }
    }

    fun getApplication(id: UUID): OrganizationApplicationResponse {
        logger.info("Service: Fetching organization application id={}", id)
        return findApplicationEntity(id).toOrganizationApplicationResponse()
    }

    @Transactional
    fun createApplication(request: CreateOrganizationApplicationRequest): OrganizationApplicationResponse {
        logger.info(
            "Service: Creating organization application clinicName='{}', organizationName='{}'",
            request.clinicName,
            request.organizationName
        )
        if (organizationService.checkOrganizationExistByBin(request.bin)) {
            throw EntityExistsException("Organization with this BIN already exists")
        }
        if (organizationApplicationRepository.existsPendingDuplicate(request.clinicName.trim(), request.bin.trim())) {
            throw EntityExistsException("Pending organization application already exists")
        }

        return organizationApplicationRepository.save(
            OrganizationApplication(
                clinicName = request.clinicName.trim(),
                organizationName = request.organizationName.trim(),
                address = request.address.trim(),
                phone = request.phone.trim(),
                email = request.email.trim(),
                bin = request.bin.trim(),
                applicantFullName = request.applicantFullName.trim(),
                applicantIin = request.applicantIin.trim(),
                comment = request.comment?.trim()?.ifBlank { null },
            )
        ).toOrganizationApplicationResponse()
    }

    @Transactional
    fun moderateApplication(
        id: UUID,
        request: ModerateOrganizationApplicationRequest
    ): OrganizationApplicationResponse {
        logger.info("Service: Moderating organization application id={} status={}", id, request.status)
        val application = findApplicationEntity(id)
        if (application.status != OrganizationApplicationStatus.PENDING) {
            throw IllegalArgumentException("Organization application has already been moderated")
        }
        if (request.status == OrganizationApplicationStatus.PENDING) {
            throw IllegalArgumentException("Organization application cannot be moved back to PENDING")
        }

        val organization = if (request.status == OrganizationApplicationStatus.APPROVED) {
            organizationService.createOrganization(
                CreateOrganizationRequest(
                    clinicName = application.clinicName,
                    organizationName = application.organizationName,
                    address = application.address,
                    phone = application.phone,
                    email = application.email,
                    bin = application.bin,
                )
            )
        } else {
            null
        }

        return organizationApplicationRepository.save(
            application.also {
                it.status = request.status
                it.moderationComment = request.moderationComment?.trim()?.ifBlank { null }
                it.moderatedAt = LocalDateTime.now()
                it.organization = organization
            }
        ).toOrganizationApplicationResponse()
    }

    private fun findApplicationEntity(id: UUID): OrganizationApplication {
        return organizationApplicationRepository.findByIdOrNull(id)
            ?.takeIf { !it.deleted }
            ?: throw EntityNotFoundException("Organization Application Not Found")
    }
}
