package kz.saphena.api.repository.room

import kz.saphena.api.model.room.Room
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface RoomRepository : JpaRepository<Room, UUID> {

    @Query(
        value = "" +
            "SELECT r " +
            "FROM Room r " +
            "WHERE r.organizationId = :organizationId " +
            "AND r.deleted = false " +
            "ORDER BY r.name"
    )
    fun findByOrganizationId(organizationId: UUID): List<Room>

    fun existsByOrganizationIdAndCode(organizationId: UUID, code: String): Boolean

//    fun existsByOrganizationIdAndName(organizationId: UUID, name: String): Boolean

    fun findByIdAndOrganizationId(id: UUID, organizationId: UUID): Room?

    @Query(
        value = "" +
            "SELECT r " +
            "FROM Room r " +
            "WHERE r.id in :ids " +
            "AND r.organizationId = :organizationId " +
            "AND r.deleted = false " +
            "ORDER BY r.code"
    )
    fun findAllByIdInAndOrganizationId(ids: Collection<UUID>, organizationId: UUID): List<Room>
}
