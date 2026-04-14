package kz.saphena.api.repository.doctor

import kz.saphena.api.model.schedule.ScheduleException
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDate
import java.util.UUID

@Repository
interface ScheduleExceptionRepository : JpaRepository<ScheduleException, UUID> {
    
    /**
     * Find all schedule exceptions for a specific organization user.
     *
     * @param orgUserId the ID of the organization user (doctor in organization)
     * @return a list of schedule exceptions for the organization user
     */
    fun findByOrgUserId(orgUserId: UUID): List<ScheduleException>
    
    /**
     * Find all schedule exceptions for a specific organization user that overlap with the given date range.
     *
     * @param orgUserId the ID of the organization user (doctor in organization)
     * @param startDate the start date of the range (inclusive)
     * @param endDate the end date of the range (inclusive)
     * @return a list of schedule exceptions that overlap with the given date range
     */
    @Query(
        "SELECT e FROM ScheduleException e WHERE e.orgUser.id = :orgUserId " +
           "AND e.endDate >= :startDate AND e.startDate <= :endDate AND e.deleted = false")
    fun findByOrgUserIdAndDateRange(
        orgUserId: UUID,
        startDate: LocalDate,
        endDate: LocalDate
    ): List<ScheduleException>
}
