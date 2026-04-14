package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.room.CreateRoomRequest
import kz.saphena.api.dto.room.UpdateRoomRequest
import kz.saphena.api.service.RoomService
import org.slf4j.LoggerFactory
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api")
class RoomController(
    private val roomService: RoomService
) {
    private val logger = LoggerFactory.getLogger(RoomController::class.java)

    @GetMapping("/rooms")
    @PreAuthorize("hasAnyRole('ROLE_ORGANIZATION_ADMIN', 'ROLE_CEO')")
    fun getRooms(
        @RequestParam(required = false) orgProcedureId: UUID?
    ) = if (orgProcedureId != null) {
        logger.info("Fetching rooms by orgProcedureId={}", orgProcedureId)
        roomService.getRoomsByProcedure(orgProcedureId)
    } else {
        logger.info("Fetching all rooms")
        roomService.getRooms()
    }

    @PostMapping("/rooms")
    @PreAuthorize("hasRole('ROLE_ORGANIZATION_ADMIN')")
    fun createRoom(
        @RequestBody @Valid request: CreateRoomRequest
    ) = run {
        logger.info("Creating room with code='{}', name='{}'", request.code, request.name)
        roomService.createRoom(request)
    }

    @GetMapping("/rooms/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ORGANIZATION_ADMIN')")
    fun getRoom(
        @PathVariable id: UUID
    ) = run {
        logger.info("Fetching room id={}", id)
        roomService.getRoom(id)
    }

    @PutMapping("/rooms")
    @PreAuthorize("hasRole('ROLE_ORGANIZATION_ADMIN')")
    fun updateRoom(
        @RequestBody @Valid request: UpdateRoomRequest
    ) = run {
        logger.info("Updating room id={}, code='{}', name='{}'", request.id, request.code, request.name)
        roomService.updateRoom(request)
    }

    @DeleteMapping("/rooms/{id}")
    @PreAuthorize("hasRole('ROLE_ORGANIZATION_ADMIN')")
    fun deleteRoom(
        @PathVariable id: UUID
    ) = run {
        logger.info("Deleting room id={}", id)
        roomService.deleteRoom(id)
    }

}
