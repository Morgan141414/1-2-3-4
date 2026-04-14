package kz.saphena.api.repository

import kz.saphena.api.model.first_entry.FirstEntry
import kz.saphena.api.model.first_entry.TrafficSourceType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.UUID

@Repository
interface FirstEntryRepository : JpaRepository<FirstEntry, UUID> {

    fun existsByPatientIdAndOrganizationId(patientId: UUID,
                                           organizationId: UUID): Boolean

    @Query(
        """
        select count(fe) from FirstEntry fe
        where fe.organizationId = :organizationId
          and fe.trafficSource = :trafficSource
          and fe.createdAt >= :from and fe.createdAt <= :to
        """
    )
    fun countByOrganizationIdAndTrafficSource(
        organizationId: UUID,
        trafficSource: TrafficSourceType,
        from: LocalDateTime,
        to: LocalDateTime
    ): Long

}