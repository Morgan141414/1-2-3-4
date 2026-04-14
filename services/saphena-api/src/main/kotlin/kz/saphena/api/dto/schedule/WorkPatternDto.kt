package kz.saphena.api.dto.schedule

import com.fasterxml.jackson.annotation.JsonFormat
import kz.saphena.api.model.schedule.WorkPatternEntity
import java.time.DayOfWeek
import java.time.LocalDateTime
import java.time.LocalTime

/**
 * DTO for representing doctor work patterns in the API.
 * Used for creating and returning work patterns that define a doctor's regular schedule.
 */
data class WorkPatternDto(
    val weekday: DayOfWeek,

    @JsonFormat(pattern = "HH:mm:ss")
    val startTime: LocalTime,

    @JsonFormat(pattern = "HH:mm:ss")
    val endTime: LocalTime,
) {
    companion object {
        fun from(pattern: WorkPatternEntity): WorkPatternDto {
            return WorkPatternDto(
                weekday = pattern.weekday,
                startTime = pattern.startTime,
                endTime = pattern.endTime,
            )
        }
    }
}

data class WorkScheduleSlotDto(
    val weekday: DayOfWeek,
    val start: LocalDateTime,
    val end: LocalDateTime
)
