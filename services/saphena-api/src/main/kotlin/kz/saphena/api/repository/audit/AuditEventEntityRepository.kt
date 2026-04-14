package kz.saphena.api.repository.audit

import kz.saphena.api.model.audit.AuditEventEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.Instant
import java.util.UUID

interface AuditEventEntityRepository : JpaRepository<AuditEventEntity, UUID> {

    @Query(
        """
        select e from AuditEventEntity e
        where (:principal is null or e.principal = :principal)
          and (:type is null or e.eventType = :type)
          and (e.eventTimestamp >= coalesce(:after, e.eventTimestamp))
        order by e.eventTimestamp desc
        """
    )
    fun findAllFiltered(
        @Param("principal") principal: String?,
        @Param("after") after: Instant?,
        @Param("type") type: String?
    ): List<AuditEventEntity>

    fun findTopByPrincipalInOrderByEventTimestampDesc(principals: List<String>): AuditEventEntity
}
