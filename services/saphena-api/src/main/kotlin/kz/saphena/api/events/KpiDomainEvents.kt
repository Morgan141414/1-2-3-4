package kz.saphena.api.events

import kz.saphena.api.model.appointment.ClientOwnershipType
import kz.saphena.api.model.assistant.AssistantType
import java.math.BigDecimal
import java.util.UUID

data class OperatorAppointmentCreatedEvent(
    val organizationId: UUID,
    val operatorId: UUID,
    val appointmentId: UUID
)

data class DoctorServiceProvidedEvent(
    val organizationId: UUID,
    val doctorId: UUID,
    val appointmentId: UUID,
    val procedureId: UUID,
    val amount: BigDecimal?,
    val clientOwnership: ClientOwnershipType
)

data class AssistantParticipationEvent(
    val organizationId: UUID,
    val assistants: List<Assistant>,
    val appointmentId: UUID,
    val protocolDataId: UUID,
)

data class Assistant(
    val assistantId: UUID,
    val assistantType: AssistantType,
)

data class ReceptionClientServedEvent(
    val organizationId: UUID,
    val receptionistId: UUID,
    val appointmentId: UUID?
)
