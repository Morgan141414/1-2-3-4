package kz.saphena.api.dto.appointment

import kz.saphena.api.dto.doctor.DoctorResponse
import kz.saphena.api.dto.doctor.toDoctorResponse
import kz.saphena.api.dto.patient.PatientResponse
import kz.saphena.api.dto.patient.toPatientResponse
import kz.saphena.api.model.appointment.Appointment
import kz.saphena.api.model.appointment.AppointmentProcedure
import kz.saphena.api.model.appointment.AppointmentStatusType
import kz.saphena.api.model.appointment.ClientOwnershipType
import kz.saphena.api.model.appointment.PaymentStatusType
import kz.saphena.api.model.appointment.PaymentType
import java.time.LocalDateTime
import java.util.UUID

data class AppointmentResponse(
    val id: UUID,
    val doctor: DoctorResponse,
    val specializationId: UUID,
    val datetime: LocalDateTime,
    val endDatetime: LocalDateTime?,
    val status: AppointmentStatusType,
    val patient: PatientResponse?,
    val procedures: List<AppointmentProcedureResponse>,
    val comment: String?,
    val clientOwnershipType: ClientOwnershipType,
    val room: String?,
    val tempPatientName: String?,
    val tempPatientPhone: String?,
    val paymentType: PaymentType,
    val paymentStatus: PaymentStatusType,
)

fun Appointment.toAppointmentResponse(
    procedures: List<AppointmentProcedure>,
    room: String?
) = AppointmentResponse(
    id = getIdSafely(),
    doctor = doctor.toDoctorResponse(orgUserId),
    specializationId = specializationId,
    datetime = datetime,
    endDatetime = endDatetime,
    status = status,
    patient = patient?.toPatientResponse(),
    procedures = procedures.map { it.toAppointmentProcedureResponse() },
    comment = comment,
    clientOwnershipType = clientOwnership,
    room = room,
    tempPatientName = tempPatientName,
    tempPatientPhone = tempPatientPhone,
    paymentType = paymentType,
    paymentStatus = paymentStatus,
)