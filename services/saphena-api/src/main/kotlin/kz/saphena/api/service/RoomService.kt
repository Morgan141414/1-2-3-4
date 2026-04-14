package kz.saphena.api.service

import jakarta.persistence.EntityExistsException
import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.dto.room.CreateRoomRequest
import kz.saphena.api.dto.room.RoomResponse
import kz.saphena.api.dto.room.UpdateRoomRequest
import kz.saphena.api.dto.room.toRoomResponse
import kz.saphena.api.model.room.Room
import kz.saphena.api.repository.appointment.AppointmentRepository
import kz.saphena.api.repository.room.RoomProcedureRepository
import kz.saphena.api.repository.room.RoomRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.UUID

@Service
class RoomService(
    private val roomRepository: RoomRepository,
    private val roomProcedureRepository: RoomProcedureRepository,
    private val appointmentRepository: AppointmentRepository,
) {
    private val logger = LoggerFactory.getLogger(RoomService::class.java)

    fun getRooms(): List<RoomResponse> {
        val orgId = OrganizationContext.getCurrentOrganizationId()
        logger.debug("Fetching rooms for orgId={}", orgId)
        return roomRepository.findByOrganizationId(orgId)
            .map { it.toRoomResponse() }
    }

    fun getRoom(id: UUID): RoomResponse {
        val orgId = OrganizationContext.getCurrentOrganizationId()
        logger.debug("Fetching room id={} for orgId={}", id, orgId)
        return roomRepository.findByIdAndOrganizationId(id, orgId)
            ?.toRoomResponse()
            ?: throw EntityNotFoundException("Room Not Found")
    }

    fun createRoom(request: CreateRoomRequest) {
        val orgId = OrganizationContext.getCurrentOrganizationId()
        val code = request.code.trim().uppercase()
        val name = request.name.trim()
        logger.info("Creating room code='{}' name='{}' for orgId={}", code, name, orgId)
        if (roomRepository.existsByOrganizationIdAndCode(orgId, code)) {
            logger.warn("Room code already exists: code='{}' orgId={}", code, orgId)
            throw EntityExistsException("Room code already exists")
        }
        roomRepository.save(
            Room(
                organizationId = orgId,
                code = code,
                name = name,
            )
        )
        logger.info("Room created: code='{}' orgId={}", code, orgId)
    }

    fun updateRoom(request: UpdateRoomRequest) {
        val orgId = OrganizationContext.getCurrentOrganizationId()
        val room = roomRepository.findByIdAndOrganizationId(request.id, orgId)
            ?: throw EntityNotFoundException("Room Not Found")

        val code = request.code.trim().uppercase()
        val name = request.name.trim()
        logger.info("Updating room id={} set code='{}' name='{}' for orgId={}", request.id, code, name, orgId)

        // Check code uniqueness if changed
        if (code != room.code && roomRepository.existsByOrganizationIdAndCode(orgId, code)) {
            logger.warn("Room code already exists on update: code='{}' orgId={}", code, orgId)
            throw EntityExistsException("Room code already exists")
        }

        roomRepository.save(
            room.also {
                it.code = code
                it.name = name
            })
        logger.info("Room updated id={} orgId={}", request.id, orgId)
    }

    fun deleteRoom(id: UUID) {
        val orgId = OrganizationContext.getCurrentOrganizationId()
        logger.info("Deleting room id={} for orgId={}", id, orgId)
        val room = roomRepository.findByIdAndOrganizationId(id, orgId)
            ?: throw EntityNotFoundException("Room Not Found")

        // Soft-delete room
        roomRepository.save(
            room.also { it.markDeleted() })
        logger.info("Room soft-deleted id={} orgId={}", id, orgId)
    }

//    fun addRoomProcedure(request: AddRoomProcedureRequest) {
//        val orgId = OrganizationContext.getCurrentOrganizationId()
//        logger.info("Adding {} procedures to room {} for orgId={}", request.procedureIds.size, request.roomId, orgId)
//        val room = roomRepository.findByIdAndOrganizationId(request.roomId, orgId)
//            ?: throw EntityNotFoundException("Room Not Found")
//        if (room.deleted) throw EntityNotFoundException("Room Not Found")
//
//        // Fetch and validate procedures
//        val procedures = request.procedureIds.map { pid ->
//            procedureRepository.findByIdOrNull(pid) ?: throw EntityNotFoundException("Procedure Not Found")
//        }
//
//        // Filter out already existing mappings to avoid unique constraint violations
//        val existing = roomProcedureRepository.findAllByRoomIdAndOrganizationIdAndProcedure_IdIn(
//            room.getIdSafely(), orgId, request.procedureIds
//        ).map { it.procedure.id }.toSet()
//        val toCreate = procedures.filter { it.id !in existing }
//        logger.debug("Existing mappings size={}, toCreate size={}", existing.size, toCreate.size)
//
//        toCreate.forEach { procedure ->
//            roomProcedureRepository.save(
//                RoomProcedure(
//                    roomId = room.getIdSafely(), organizationId = orgId, procedure = procedure
//                )
//            )
//        }
//        logger.info("Room-procedure mappings created: {} items for room {}", toCreate.size, request.roomId)
//    }

//    fun removeRoomProcedures(request: kz.saphena.api.dto.room.RemoveRoomProcedureRequest) {
//        val orgId = OrganizationContext.getCurrentOrganizationId()
//        logger.info(
//            "Removing {} procedures from room {} for orgId={}",
//            request.procedureIds.size,
//            request.roomId,
//            orgId
//        )
//        // Bulk delete by room and procedure ids within org
//        roomProcedureRepository.deleteAllByRoomIdAndOrganizationIdAndProcedure_IdIn(
//            request.roomId, orgId, request.procedureIds
//        )
//        logger.info("Room-procedure mappings removed for room {}: {} ids", request.roomId, request.procedureIds.size)
//    }

    fun getRoomsByProcedure(orgProcedureId: UUID): List<RoomResponse> {
        val orgId = OrganizationContext.getCurrentOrganizationId()
        logger.debug("Fetching rooms by orgProcedureId={}", orgProcedureId)
        val mappings = roomProcedureRepository.findByOrganizationProcedureId(orgProcedureId)
        val roomIds = mappings.map { it.roomId }.toSet()
        if (roomIds.isEmpty()) {
            logger.debug("No rooms mapped to orgProcedureId={}", orgProcedureId)
            return emptyList()
        }
        return roomRepository.findAllByIdInAndOrganizationId(roomIds, orgId)
            .map { it.toRoomResponse() }
    }

    fun getRoomsByProcedures(
        procedureIds: Collection<UUID>,
        start: LocalDateTime,
        end: LocalDateTime,
    ): List<RoomResponse> {
        val orgId = OrganizationContext.getCurrentOrganizationId()
        logger.debug(
            "Fetching available rooms by {} procedureIds for orgId={} and window {} - {}",
            procedureIds.size,
            orgId,
            start,
            end
        )
        if (procedureIds.isEmpty()) return emptyList()

        // Find rooms mapped to provided procedures
        val mappings = roomProcedureRepository.findByProcedureIdInAndOrganizationId(procedureIds, orgId)
        val roomIds = mappings.map { it.roomId }.toSet()
        if (roomIds.isEmpty()) return emptyList()

        // Fetch appointments overlapping the requested window for this doctor with assigned rooms
        val overlapping = appointmentRepository.findOverlappingWithRoomByOrganization(orgId, start, end)
        val busyRoomIds = overlapping.mapNotNull { it.roomId }.toSet()
        val freeRoomIds = roomIds - busyRoomIds
        if (freeRoomIds.isEmpty()) return emptyList()

        return roomRepository.findAllByIdInAndOrganizationId(freeRoomIds, orgId)
            .map { it.toRoomResponse() }
    }

//    fun getRoomProcedures(roomId: UUID): List<ProcedureResponse> {
//        val orgId = OrganizationContext.getCurrentOrganizationId()
//        logger.debug("Fetching room procedures by roomId={} for orgId={}", roomId, orgId)
//        val mappings = roomProcedureRepository.findByRoomIdAndOrganizationId(roomId, orgId)
//        if (mappings.isEmpty()) return emptyList()
//        return mappings.map { pMap ->
//            pMap.organizationProcedure.procedure.toProcedureResponse()
//        }
//    }
}
