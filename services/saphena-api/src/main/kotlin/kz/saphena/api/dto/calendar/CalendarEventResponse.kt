package kz.saphena.api.dto.calendar

import kz.saphena.api.dto.appointment.AppointmentProcedureResponse
import kz.saphena.api.model.appointment.Appointment
import kz.saphena.api.utils.getFullName
import java.time.LocalDateTime
import java.util.UUID

data class CalendarEventResponse(
    val id: UUID? = null,
    val start: LocalDateTime,
    val end: LocalDateTime,
    val title: String? = null,
    val meta: CalendarEventMetaData? = null
)

fun Appointment.toCalendarEventResponse(
    procedures: List<AppointmentProcedureResponse>
) = CalendarEventResponse(
    id = getIdSafely(),
    start = datetime,
    end = endDatetime ?: datetime.plusMinutes(10),
    title = procedures.joinToString(", ") { p -> p.procedure.name },
    meta = CalendarEventMetaData(
        status = status,
        procedureType = procedures[0].procedure.type,
        patientId = patient?.getIdSafely(),
        patientFullname = patient?.let { getFullName(it.firstName, it.lastName, it.middleName) }
            ?: tempPatientName ?: "unknown",
        verificationStatus = if (patient?.isCitizen == true) {
            patient?.iinVerificationStatus
        } else {
            patient?.getActiveDocument()?.verificationStatus
        }
    )
)
