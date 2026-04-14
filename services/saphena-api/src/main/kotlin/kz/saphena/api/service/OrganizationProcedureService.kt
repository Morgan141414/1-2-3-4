package kz.saphena.api.service

import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.dto.procedure.OrganizationProcedureResponse
import kz.saphena.api.dto.procedure.SyncOrgProceduresRequest
import kz.saphena.api.dto.procedure.UpdateOrganizationProcedureRequest
import kz.saphena.api.dto.procedure.toOrganizationProcedureResponse
import kz.saphena.api.dto.specialization.SpecializationResponse
import kz.saphena.api.dto.specialization.toSpecializationResponse
import kz.saphena.api.model.procedure.OrganizationProcedure
import kz.saphena.api.model.protocol.ProtocolTargetType
import kz.saphena.api.model.room.RoomProcedure
import kz.saphena.api.repository.procedure.OrganizationProcedureRepository
import kz.saphena.api.repository.procedure.ProcedureRepository
import kz.saphena.api.repository.protocol.ProtocolRepository
import kz.saphena.api.repository.room.RoomProcedureRepository
import kz.saphena.api.repository.room.RoomRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class OrganizationProcedureService(
    private val organizationProcedureRepository: OrganizationProcedureRepository,
    private val procedureRepository: ProcedureRepository,
    private val roomRepository: RoomRepository,
    private val roomProcedureRepository: RoomProcedureRepository,
    private val protocolRepository: ProtocolRepository,
) {

    fun getOrganizationProcedures(specializationId: UUID): List<OrganizationProcedureResponse> {
        val organizationId = OrganizationContext.getCurrentOrganizationId()

        return organizationProcedureRepository.findAllByOrganizationIdAndSpecializationId(
            organizationId = organizationId,
            specializationId = specializationId,
        )
            .map {
                val roomIds = roomProcedureRepository.findByOrganizationProcedureId(it.getIdSafely())
                    .map { rp -> rp.roomId }
                it.toOrganizationProcedureResponse(roomIds, null)
            }
    }

    fun getOrganizationProcedure(id: UUID): OrganizationProcedureResponse {
        val organizationProcedure = organizationProcedureRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Organization procedure with id $id not found")

        val roomIds = roomProcedureRepository.findByOrganizationProcedureId(id)
            .map { rp -> rp.roomId }

        return organizationProcedure
            .toOrganizationProcedureResponse(
                roomIds = roomIds,
                modified = null,
            )

    }

    @Transactional
    fun updateOrganizationProcedure(
        id: UUID,
        request: UpdateOrganizationProcedureRequest,
    ) {
        val orgProcedure = organizationProcedureRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Organization procedure with id $id not found")

        organizationProcedureRepository.save(
            orgProcedure.also {
                it.roomRequired = request.roomRequired
            }
        )

        // Handle room mapping updates if provided
        val newRoomIds = request.roomIds.toSet()

        // Validate rooms belong to org and exist
        val orgId = OrganizationContext.getCurrentOrganizationId()
        val validRooms = roomRepository.findAllByIdInAndOrganizationId(newRoomIds, orgId)

        val validRoomIds = validRooms.map { it.getIdSafely() }.toSet()

        if (validRoomIds.size != newRoomIds.size) {
            throw EntityNotFoundException("Some rooms not found")
        }

        // Fetch existing mappings for this procedure within org
        val existingMappings = roomProcedureRepository.findByOrganizationProcedureId(id)

        val existingRoomIds = existingMappings
            .map { it.roomId }
            .toSet()

        // Determine additions and removals
        val toAdd = newRoomIds - existingRoomIds
        val toRemove = existingRoomIds - newRoomIds

        // Add new mappings
        toAdd.forEach { roomId ->
            roomProcedureRepository.save(
                RoomProcedure(
                    roomId = roomId,
                    organizationProcedure = orgProcedure
                )
            )
        }

        // Remove obsolete mappings
        if (toRemove.isNotEmpty()) {
            roomProcedureRepository.deleteAllByOrganizationProcedure_IdAndRoomIdIn(
                organizationProcedureId = orgProcedure.getIdSafely(),
                roomIds = toRemove
            )
        }
    }

    fun disableOrganizationProcedure(id: UUID) {
        organizationProcedureRepository.deleteById(id)
    }

    fun restoreOrganizationProcedure(id: UUID) {
        val orgProcedure = organizationProcedureRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Organization procedure with id $id not found")

        organizationProcedureRepository.save(
            orgProcedure.also {
                it.restore()
            }
        )
    }

    fun syncOrganizationProcedures(specializationId: UUID,
                                   request: SyncOrgProceduresRequest) {
        val organizationId = OrganizationContext.getCurrentOrganizationId()

        val requestedIds = request.procedureIds.toSet()

        val existing = organizationProcedureRepository
            .findAllByOrganizationIdAndSpecializationId(
                specializationId = specializationId,
                organizationId = organizationId
            )

        val existingByProcedureId = existing
            .associateBy { it.procedure.id }

        requestedIds.forEach { procedureId ->
            val op = existingByProcedureId[procedureId]

            when {
                op == null -> {
                    organizationProcedureRepository.save(
                        OrganizationProcedure(
                            organizationId = organizationId,
                            procedure = procedureRepository.getReferenceById(procedureId),
                            roomRequired = false
                        )
                    )
                }
                op.deleted -> {
                    organizationProcedureRepository.save(
                        op.apply { restore() }
                    )
                }
            }
        }

        existing
            .filter { it.procedure.id !in requestedIds && !it.deleted }
            .forEach { organizationProcedureRepository.delete(it) }
    }

    fun getActiveOrganizationProcedures(specializationId: UUID): List<OrganizationProcedureResponse> {
        val organizationId = OrganizationContext.getCurrentOrganizationId()

        val modifiedIds = protocolRepository
            .findAllModifiedTargetIds(
                targetType = ProtocolTargetType.PROCEDURE,
                organizationId = organizationId,
            )

        return organizationProcedureRepository.findActiveOrganizationProcedures(
            organizationId = organizationId,
            specializationId = specializationId,
        )
            .map {
                it.toOrganizationProcedureResponse(
                    roomIds = emptyList(),
                    modified = modifiedIds.contains(it.procedure.id),
                )
            }
    }

    fun getSpecializations(): List<SpecializationResponse> {
        val organizationId = OrganizationContext.getCurrentOrganizationId()

        return organizationProcedureRepository.findActiveSpecializations(organizationId)
            .map { it.toSpecializationResponse() }
    }

}