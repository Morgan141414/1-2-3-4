package kz.saphena.api.controller

import kz.saphena.api.service.RoomService
import org.slf4j.LoggerFactory
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime
import java.util.UUID

@RestController
@RequestMapping("/api/room-procedures")
class RoomProcedureController(
    private val roomService: RoomService
) {
    private val logger = LoggerFactory.getLogger(RoomProcedureController::class.java)

//    // Mapping procedures to rooms
//    @PostMapping
//    @PreAuthorize("hasRole('ROLE_ORGANIZATION_ADMIN')")
//    fun addRoomProcedure(
//        @RequestBody @Valid request: AddRoomProcedureRequest
//    ) = run {
//        logger.info("Adding procedures {} to room {}", request.procedureIds, request.roomId)
//        roomService.addRoomProcedure(request)
//    }

//    @DeleteMapping
//    @PreAuthorize("hasRole('ROLE_ORGANIZATION_ADMIN')")
//    fun removeRoomProcedures(
//        @RequestBody @Valid request: RemoveRoomProcedureRequest
//    ) = run {
//        logger.info("Removing procedures {} from room {}", request.procedureIds, request.roomId)
//        roomService.removeRoomProcedures(request)
//    }

//    @GetMapping
//    @PreAuthorize("hasAnyRole('ROLE_ORGANIZATION_ADMIN')")
//    fun getRoomProcedures(
//        @RequestParam roomId: UUID
//    ) = run {
//        logger.info("Fetching procedures for room id={}", roomId)
//        roomService.getRoomProcedures(roomId)
//    }

    @GetMapping("available")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_OPERATOR', 'ROLE_RECEPTIONIST')")
    fun getRoomsByProcedures(
        @RequestParam procedureIds: List<UUID>,
        @RequestParam start: LocalDateTime,
        @RequestParam end: LocalDateTime,
    ) = run {
        logger.info("Fetching available rooms linked to {} procedures between {} and {}", procedureIds.size, start, end)
        roomService.getRoomsByProcedures(procedureIds, start, end)
    }
}
