package kz.saphena.api.repository.doctor

import kz.saphena.api.model.schedule.WorkPatternEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface WorkPatternRepository : JpaRepository<WorkPatternEntity, UUID> {
    
    /**
     * Find all work patterns for a specific schedule.
     *
     * @param scheduleId the ID of the schedule
     * @return a list of work patterns for the schedule
     */
    fun findByScheduleId(scheduleId: UUID): List<WorkPatternEntity>
}
