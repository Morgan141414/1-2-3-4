package kz.saphena.api.repository.kpi

import kz.saphena.api.model.kpi.KpiEvent
import kz.saphena.api.model.kpi.KpiEventType
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@Repository
interface KpiEventRepository : JpaRepository<KpiEvent, UUID> {

    fun deleteByProtocolDataIdAndEventType(
        protocolDataId: UUID,
        eventType: KpiEventType
    )

    @Query("""
        select e from KpiEvent e
        where e.eventType = :type
        and e.organizationId = :organizationId
        and e.occurredAt >= :from and e.occurredAt <= :to
    """)
    fun findOrganizationEventsByTypeAndRange(
        type: KpiEventType,
        organizationId: UUID,
        from: LocalDateTime,
        to: LocalDateTime,
    ): List<KpiEvent>

    @Query(
        """
        select e from KpiEvent e
        where e.organizationId = :organizationId
          and e.userId = :userId
          and e.occurredAt >= :from and e.occurredAt <= :to
        """
    )
    fun findOrganizationEvents(
        organizationId: UUID,
        userId: UUID,
        from: LocalDateTime,
        to: LocalDateTime,
        pageable: Pageable
    ): Page<KpiEvent>

    @Query("""
        select coalesce(sum(e.amount), 0) from KpiEvent e 
        where e.organizationId = :organizationId 
        and e.occurredAt >= :from and e.occurredAt <= :to
    """)
    fun getTotalIncomeByOrganizationId(
        organizationId: UUID,
        from: LocalDateTime,
        to: LocalDateTime,
    ): BigDecimal

}
