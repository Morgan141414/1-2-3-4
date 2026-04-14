package kz.saphena.api.repository.room

import kz.saphena.api.model.room.RoomProcedure
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface RoomProcedureRepository : JpaRepository<RoomProcedure, UUID> {

    @Query("""
        select rp
        from RoomProcedure rp
        where rp.organizationProcedure.id = :organizationProcedureId
            and rp.organizationProcedure.deleted = false 
    """)
    fun findByOrganizationProcedureId(organizationProcedureId: UUID): List<RoomProcedure>

    @Query("""
        select rp
        from RoomProcedure rp
        where rp.organizationProcedure.procedure.id in :procedureIds
            and rp.organizationProcedure.organizationId = :organizationId 
            and rp.organizationProcedure.deleted = false
    """)
    fun findByProcedureIdInAndOrganizationId(
        procedureIds: Collection<UUID>,
        organizationId: UUID,
    ): List<RoomProcedure>

//    @Query("""
//        select rp
//        from RoomProcedure rp
//        where rp.roomId = :roomId
//            and rp.organizationProcedure.organizationId = :organizationId
//            and rp.organizationProcedure.deleted = false
//    """)
//    fun findByRoomIdAndOrganizationId(
//        roomId: UUID,
//        organizationId: UUID,
//    ): List<RoomProcedure>

//    fun findAllByRoomIdAndOrganizationIdAndProcedure_IdIn(roomId: UUID, organizationId: UUID, procedureIds: Collection<UUID>): List<RoomProcedure>
//
//    fun deleteAllByRoomIdAndOrganizationIdAndProcedure_IdIn(roomId: UUID, organizationId: UUID, procedureIds: Collection<UUID>)
//
//    // Procedure-centric helpers
//    fun findAllByProcedure_IdAndOrganizationIdAndRoomIdIn(procedureId: UUID, organizationId: UUID, roomIds: Collection<UUID>): List<RoomProcedure>
//
//    fun deleteAllByProcedure_IdAndOrganizationIdAndRoomIdIn(procedureId: UUID, organizationId: UUID, roomIds: Collection<UUID>)

    fun deleteAllByOrganizationProcedure_IdAndRoomIdIn(
        organizationProcedureId: UUID,
        roomIds: Collection<UUID>,
    )
}
