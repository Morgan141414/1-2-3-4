package kz.saphena.api.dto.schedule

import com.fasterxml.jackson.annotation.JsonFormat
import kz.saphena.api.model.schedule.WorkScheduleEntity
import java.time.LocalDate
import java.util.UUID

/**
 * DTO for representing doctor work schedules in the API.
 * Used for creating and returning work schedules that define a doctor's regular schedule across multiple days.
 */
data class WorkScheduleDto(
    val id: UUID? = null,
    val orgUserId: UUID,
    val name: String,

    @JsonFormat(pattern = "yyyy-MM-dd")
    val startDate: LocalDate,

    @JsonFormat(pattern = "yyyy-MM-dd")
    val endDate: LocalDate? = null,

    val patterns: List<WorkPatternDto> = emptyList()
) {
    companion object {
        fun from(schedule: WorkScheduleEntity, includePatterns: Boolean = false): WorkScheduleDto {
            return WorkScheduleDto(
                id = schedule.id,
                orgUserId = schedule.orgUser.getIdSafely(),
                name = schedule.name,
                startDate = schedule.startDate,
                endDate = schedule.endDate,
                patterns = if (includePatterns) schedule.workPatterns.map { WorkPatternDto.from(it) } else emptyList()
            )
        }
    }
}

/**
 * DTO for creating a new work schedule.
 */
data class CreateWorkScheduleRequest(
    val orgUserId: UUID,
    val name: String,

    @JsonFormat(pattern = "yyyy-MM-dd")
    val startDate: LocalDate,

    @JsonFormat(pattern = "yyyy-MM-dd")
    val endDate: LocalDate? = null,

    val patterns: List<WorkPatternDto> = emptyList()
)

/**
 * DTO for updating an existing work schedule.
 */
data class UpdateWorkScheduleRequest(
    val id: UUID,
    val name: String,

    @JsonFormat(pattern = "yyyy-MM-dd")
    val startDate: LocalDate,

    @JsonFormat(pattern = "yyyy-MM-dd")
    val endDate: LocalDate? = null,

    val patterns: List<WorkPatternDto> = emptyList()
)
