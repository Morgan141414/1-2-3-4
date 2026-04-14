package kz.saphena.api.dto.calendar

import kz.saphena.api.model.appointment.AppointmentStatusType
import kz.saphena.api.model.patient.PatientDocumentVerificationStatus
import kz.saphena.api.model.procedure.ProcedureType
import java.util.UUID

data class CalendarEventMetaData(
    val status: AppointmentStatusType,
    val procedureType: ProcedureType,
    val patientId: UUID?,
    val patientFullname: String,
    val verificationStatus: PatientDocumentVerificationStatus?,
)
