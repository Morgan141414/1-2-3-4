package kz.saphena.api.service

import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.dto.protocol.CreateProtocolRequest
import kz.saphena.api.dto.protocol.ProtocolResponse
import kz.saphena.api.model.patient.GenderType
import kz.saphena.api.model.protocol.Protocol
import kz.saphena.api.model.protocol.ProtocolTargetType
import kz.saphena.api.model.user.UserRoleType
import kz.saphena.api.repository.protocol.ProtocolRepository
import kz.saphena.api.utils.nullIfBlankTrimmed
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class ProtocolService(
    private val protocolRepository: ProtocolRepository,
    private val meService: MeService
) {

    fun getActiveProtocol(
        targetType: ProtocolTargetType,
        targetId: UUID,
        gender: GenderType?
    ): ProtocolResponse {
        val organizationId =
            if (meService.me().role != UserRoleType.SUPERADMIN)
                OrganizationContext.getCurrentOrganizationId()
            else null

        val activeProtocols = protocolRepository.findActiveProtocol(
            targetType = targetType,
            targetId = targetId,
            organizationId = organizationId
        )

        val protocol = activeProtocols.firstOrNull()
            ?: throw EntityNotFoundException(
                "Active protocol not found for targetType=$targetType, targetId=$targetId, org=$organizationId"
            )

        val filteredSections = protocol.sections.map { section ->
            section.copy(
                fields = if (gender == null) {
                    section.fields
                } else {
                    section.fields.filter { it.gender == null || it.gender == gender }
                }
            )
        }

        return ProtocolResponse(
            id = protocol.getIdSafely(),
            sections = filteredSections,
            consultationRequired = protocol.consultationRequired,
            templateFileName = protocol.templateFileName,
            modified = protocol.organizationId != null
        )
    }

    @Transactional
    fun createOrUpdateProtocol(
        targetType: ProtocolTargetType,
        targetId: UUID,
        request: CreateProtocolRequest
    ) {
        val organizationId = if (meService.me().role != UserRoleType.SUPERADMIN)
            OrganizationContext.getCurrentOrganizationId()
        else null

        protocolRepository.deactivateOldProtocols(
            targetType = targetType,
            targetId = targetId,
            organizationId = organizationId
        )

        protocolRepository.save(
            Protocol(
                targetType = targetType,
                targetId = targetId,
                organizationId = organizationId,
                isActive = true,
                sections = request.sections,
                consultationRequired = request.consultationRequired,
                templateFileName = request.templateFileName.nullIfBlankTrimmed()
            )
        )
    }

    @Transactional
    fun resetProtocolToTemplate(
        targetType: ProtocolTargetType,
        targetId: UUID,
    ) {
        val organizationId = OrganizationContext.getCurrentOrganizationId()

        val updated = protocolRepository.deactivateActiveOrgProtocol(
            targetType = targetType,
            targetId = targetId,
            organizationId = organizationId,
        )

        if (updated == 0) {
            throw EntityNotFoundException(
                "Active organization protocol not found for reset"
            )
        }

    }

}