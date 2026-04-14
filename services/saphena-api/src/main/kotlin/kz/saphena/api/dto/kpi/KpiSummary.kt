package kz.saphena.api.dto.kpi

import kz.saphena.api.model.assistant.AssistantType
import java.math.BigDecimal
import java.util.UUID

data class DoctorKpiSummary(
    val doctorId: UUID,
    val totalRevenue: BigDecimal,
    val doctorShare: BigDecimal,
    val clinicShare: BigDecimal,
    val doctorFullname: String,
)

data class AssistantKpiSummary(
    val assistantId: UUID,
    val participations: List<AssistantParticipation>,
    val assistantFullname: String,
)

data class OperatorKpiSummary(
    val operatorId: UUID,
    val appointmentsCreated: Long,
    val operatorUsername: String,
)

data class ReceptionKpiSummary(
    val receptionistId: UUID,
    val clientsServed: Long,
    val receptionUsername: String,
)

data class AssistantParticipation(
    val assistantType: AssistantType?,
    val count: Long,
)
