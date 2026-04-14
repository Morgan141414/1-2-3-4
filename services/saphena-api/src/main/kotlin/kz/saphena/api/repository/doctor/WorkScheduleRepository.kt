package kz.saphena.api.repository.doctor

import kz.saphena.api.model.schedule.WorkScheduleEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDate
import java.util.UUID

@Repository
interface WorkScheduleRepository : JpaRepository<WorkScheduleEntity, UUID> {
    
    /**
     * Find all work schedules for a specific organization user.
     *
     * @param orgUserId the ID of the organization user (doctor in organization)
     * @return a list of work schedules for the organization user
     */
    fun findByOrgUserId(orgUserId: UUID): List<WorkScheduleEntity>

    /**
     * Find all active work schedules for a specific organization user that overlap the given date range.
     * The range is [startDate, endDate) on the database query level.
     *
     * @param orgUserId the ID of the organization user (doctor in organization)
     * @param startDate the start date of the interval (inclusive)
     * @param endDate the end date of the interval (exclusive)
     * @return a list of active work schedules overlapping the given date range
     */
    @Query("SELECT s FROM WorkScheduleEntity s WHERE s.orgUser.id = :orgUserId AND s.startDate < :endDate AND (s.endDate IS NULL OR s.endDate > :startDate)")
    fun findActiveSchedulesForDate(
        orgUserId: UUID,
        startDate: LocalDate,
        endDate: LocalDate,
    ): List<WorkScheduleEntity>
}
