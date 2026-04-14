package kz.saphena.api.dto.appointment

import jakarta.validation.constraints.NotNull
import kz.saphena.api.model.appointment.ClientOwnershipType
import kz.saphena.api.model.first_entry.TrafficSourceType
import java.time.LocalDateTime
import java.util.UUID

data class CreateAppointmentRequest(
    @get:NotNull
    val doctorId: UUID,
    @get:NotNull
    val specializationId: UUID,
    @get:NotNull
    val orgUserId: UUID,
    @get:NotNull
    val procedures: List<AddAppointmentProcedureRequest>,
    @get:NotNull
    val datetime: LocalDateTime,
    @get:NotNull
    val endDatetime: LocalDateTime,
    val patientId: UUID?,
    val trafficSource: TrafficSourceType?,
    val roomId: UUID?,
    val clientOwnershipType: ClientOwnershipType = ClientOwnershipType.CLINIC,
    val tempPatientName: String?,
    val tempPatientPhone: String?,
)
