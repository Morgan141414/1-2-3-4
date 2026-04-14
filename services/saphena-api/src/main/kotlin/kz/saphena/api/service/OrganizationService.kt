package kz.saphena.api.service

import jakarta.persistence.EntityExistsException
import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.dto.PageResponse
import kz.saphena.api.dto.organization.CreateOrganizationRequest
import kz.saphena.api.dto.organization.OrganizationResponse
import kz.saphena.api.dto.organization.OrganizationUserResponse
import kz.saphena.api.dto.organization.toOrganizationResponse
import kz.saphena.api.dto.user.CreateUserRequestRequest
import kz.saphena.api.dto.user.UserResponse
import kz.saphena.api.model.organization.Organization
import kz.saphena.api.model.organization.OrganizationUser
import kz.saphena.api.model.user.UserRoleType
import kz.saphena.api.repository.organization.OrganizationRepository
import kz.saphena.api.repository.organization.OrganizationUserRepository
import kz.saphena.api.utils.nullIfBlankTrimmed
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class OrganizationService(
    private val organizationRepository: OrganizationRepository,
    private val userService: UserService,
    private val organizationUserRepository: OrganizationUserRepository
) {
    private val logger = LoggerFactory.getLogger(OrganizationService::class.java)

    fun getOrganizations(pageable: Pageable): PageResponse<OrganizationResponse> {
        logger.info(
            "Service: Fetching organizations page={} size={} sort={}",
            pageable.pageNumber,
            pageable.pageSize,
            pageable.sort
        )
        return organizationRepository.findOrganizations(pageable)
            .map { it.toOrganizationResponse() }
            .let {
                PageResponse(
                    content = it.content,
                    totalPages = it.totalPages,
                    number = it.number,
                    last = it.isLast
                )
            }
    }

    fun getOrganization(id: UUID): OrganizationResponse {
        logger.info("Service: Fetching organization id={}", id)
        return organizationRepository.findByIdOrNull(id)
            ?.toOrganizationResponse()
            ?: throw EntityNotFoundException("Organization Not Found")
    }

    fun createOrganization(request: CreateOrganizationRequest) {
        logger.info(
            "Service: Creating organization clinicName='{}', organizationName='{}'",
            request.clinicName,
            request.organizationName
        )
        if (organizationRepository.existsByClinicName(request.clinicName)) {
            throw EntityExistsException("Organization already exists")
        }

        organizationRepository.save(
            Organization(
                clinicName = request.clinicName.trim(),
                organizationName = request.organizationName.trim(),
                address = request.address.trim(),
                phone = request.phone.trim(),
                email = request.email.trim(),
                bin = request.bin,
            )
        )
    }

    fun updateOrganization(
        id: UUID,
        request: CreateOrganizationRequest,
    ) {
        logger.info(
            "Service: Updating organization id={}, clinicName='{}', organizationName='{}'",
            id,
            request.clinicName,
            request.organizationName
        )
        val organization = organizationRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Organization Not Found")
        if (organization.clinicName != request.clinicName && organizationRepository.existsByClinicName(request.clinicName)) {
            throw EntityExistsException("Organization already exists")
        }

        organizationRepository.save(
            organization.also {
                it.clinicName = request.clinicName.trim()
                it.organizationName = request.organizationName.trim()
                it.address = request.address.trim()
                it.phone = request.phone.trim()
                it.email = request.email.trim()
                it.bin = request.bin.trim()
            }
        )
    }

    fun deleteOrganization(id: UUID) {
        logger.info("Service: Deleting organization id={}", id)
        val organization = organizationRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Organization Not Found")

        organizationRepository.save(
            organization.also {
                it.markDeleted()
            }
        )
    }

    fun getOrganizationsByIds(ids: List<UUID>): List<OrganizationResponse> {
        logger.info("Service: Fetching organizations by ids count={}", ids.size)
        return organizationRepository.findAllById(ids)
            .map { it.toOrganizationResponse() }
    }

    fun getOrganizationUsers(
        id: UUID?,
        roleType: UserRoleType
    ): List<OrganizationUserResponse> {
        val orgId = id ?: OrganizationContext.getCurrentOrganizationId()
        logger.info("Service: Fetching organization users orgId={} roleType={}", orgId, roleType)

        return organizationUserRepository.findOrganizationUsersByOrganizationIdAndRole(orgId, roleType)
            .map {
                OrganizationUserResponse(
                    id = it.getIdSafely(),
                    user = UserResponse(
                        id = it.user.getIdSafely(),
                        username = it.user.username,
                        role = it.user.role
                    )
                )
            }
    }

    @Transactional
    fun addOrganizationUser(
        id: UUID?,
        roleType: UserRoleType,
        request: CreateUserRequestRequest
    ) {
        logger.info("Service: Adding organization user username='{}' roleType={}", request.username, roleType)
        val user = userService.createUser(request, roleType)

        val orgId = id ?: OrganizationContext.getCurrentOrganizationId()
        logger.info("Service: Linking user to organization orgId={}", orgId)
        val organization = organizationRepository.findByIdOrNull(orgId)
            ?: throw EntityNotFoundException("Organization User Not Found")

        organizationUserRepository.save(
            OrganizationUser(
                user = user,
                organization = organization
            )
        )
    }

    @Transactional
    fun removeOrganizationUser(id: UUID) {
        logger.info("Service: Removing organization user id={}", id)
        val orgUser = organizationUserRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Organization User Not Found")

        organizationUserRepository.save(
            orgUser.also {
                it.markDeleted()
            }
        )
        userService.deleteUser(orgUser.user.getIdSafely())
    }

    fun checkOrganizationExistByBin(bin: String): Boolean {
        return organizationRepository.existsByBin(bin)
    }

}
