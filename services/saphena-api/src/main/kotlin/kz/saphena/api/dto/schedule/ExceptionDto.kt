package kz.saphena.api.dto.schedule

import com.fasterxml.jackson.annotation.JsonFormat
import kz.saphena.api.model.schedule.ScheduleException
import java.time.LocalDate
import java.util.UUID

/**
 * DTO for representing doctor schedule exceptions in the API.
 * Used for creating and returning schedule exceptions like vacations, trainings, holidays, etc.
 */
data class ExceptionDto(
    @JsonFormat(pattern = "yyyy-MM-dd")
    val startDate: LocalDate,

    @JsonFormat(pattern = "yyyy-MM-dd")
    val endDate: LocalDate,

    val note: String? = null
) {
    companion object {
        fun from(exception: ScheduleException): ExceptionDto {
            return ExceptionDto(
                startDate = exception.startDate,
                endDate = exception.endDate,
                note = exception.note
            )
        }
    }
}

/**
 * DTO for creating a new work schedule.
 */
data class CreateExceptionRequest(
    val orgUserId: UUID,

    @JsonFormat(pattern = "yyyy-MM-dd")
    val startDate: LocalDate,

    @JsonFormat(pattern = "yyyy-MM-dd")
    val endDate: LocalDate,

    val note: String? = null
)
