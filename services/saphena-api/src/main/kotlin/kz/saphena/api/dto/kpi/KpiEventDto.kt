package kz.saphena.api.dto.kpi

import kz.saphena.api.dto.patient.PatientResponse
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID
import kz.saphena.api.model.appointment.ClientOwnershipType
import kz.saphena.api.model.assistant.AssistantType
import kz.saphena.api.model.kpi.KpiEvent
import kz.saphena.api.model.kpi.KpiEventType
import kz.saphena.api.model.user.UserRoleType

/**
 * DTO for exposing KPI events via API.
 */
data class KpiEventDto(
    val id: UUID?,
    val organizationId: UUID,
    val userId: UUID,
    val userRole: UserRoleType,
    val eventType: KpiEventType,
    val clientOwnershipType: ClientOwnershipType,
    val appointmentId: UUID?,
    val procedureId: UUID?,
    val protocolDataId: UUID?,
    val occurredAt: LocalDateTime,
    val assistantType: AssistantType?,
    var amount: BigDecimal?,
    var patient: PatientResponse?,
    var procedureName: String?,
)

fun KpiEvent.toDto() = KpiEventDto(
    id = this.id,
    organizationId = this.organizationId,
    userId = this.userId,
    userRole = this.userRole,
    eventType = this.eventType,
    clientOwnershipType = this.clientOwnershipType,
    appointmentId = this.appointmentId,
    procedureId = this.procedureId,
    protocolDataId = this.protocolDataId,
    amount = this.amount,
    occurredAt = this.occurredAt,
    assistantType = this.assistantType,
    patient = null,
    procedureName = null,
)
