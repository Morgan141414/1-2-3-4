package kz.saphena.api.dto.room

import jakarta.validation.constraints.NotBlank
import kz.saphena.api.model.room.Room
import java.util.UUID

data class CreateRoomRequest(
    @get:NotBlank
    val code: String,
    @get:NotBlank
    val name: String,
)

data class UpdateRoomRequest(
    val id: UUID,
    @get:NotBlank
    val code: String,
    @get:NotBlank
    val name: String,
)

//// Refactored to support bulk mapping of procedures to a room
//data class AddRoomProcedureRequest(
//    @get:NotNull
//    val roomId: UUID,
//    @get:NotEmpty
//    val procedureIds: List<UUID>,
//)

//// New request for bulk removal of mappings
//data class RemoveRoomProcedureRequest(
//    @get:NotNull
//    val roomId: UUID,
//    @get:NotEmpty
//    val procedureIds: List<UUID>,
//)

data class RoomResponse(
    val id: UUID,
    val code: String,
    val name: String,
)

fun Room.toRoomResponse() = RoomResponse(
    id = getIdSafely(),
    code = code,
    name = name,
)
