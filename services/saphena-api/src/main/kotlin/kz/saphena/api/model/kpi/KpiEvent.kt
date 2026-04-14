package kz.saphena.api.model.kpi

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID
import kz.saphena.api.model.AbstractBaseAuditableEntity
import kz.saphena.api.model.appointment.ClientOwnershipType
import kz.saphena.api.model.assistant.AssistantType
import kz.saphena.api.model.user.UserRoleType

@Entity
class KpiEvent(
    val organizationId: UUID,
    var userId: UUID,
    @Enumerated(EnumType.STRING)
    val userRole: UserRoleType,
    @Enumerated(EnumType.STRING)
    val eventType: KpiEventType,
    @Enumerated(value = EnumType.STRING)
    val clientOwnershipType: ClientOwnershipType,
    val appointmentId: UUID?,
    val procedureId: UUID?,
    val protocolDataId: UUID?,
    @Column(precision = 12, scale = 2)
    val amount: BigDecimal?,
    val occurredAt: LocalDateTime = LocalDateTime.now(),
    @Enumerated(value = EnumType.STRING)
    val assistantType: AssistantType?,
) : AbstractBaseAuditableEntity()

enum class KpiEventType {
    OPERATOR_APPOINTMENT_CREATED,
    DOCTOR_SERVICE_PROVIDED,
    ASSISTANT_PARTICIPATION,
    RECEPTION_CLIENT_SERVED
}
