package kz.saphena.api.model.notification

import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import kz.saphena.api.model.AbstractBaseAuditableEntity
import kz.saphena.api.model.appointment.Appointment
import java.time.LocalDateTime

@Entity
@Table(name = "notification")
class NotificationEntity(
    @ManyToOne
    var appointment: Appointment,
    var phone: String,
    var message: String,
    var scheduledAt: LocalDateTime,
    @Enumerated(EnumType.STRING)
    var notifyType: NotifyType,
    @Enumerated(EnumType.STRING)
    var status: NotifyStatus,
): AbstractBaseAuditableEntity()

enum class NotifyType { ON_CREATE, ON_RESCHEDULE, ON_CANCEL }

enum class NotifyStatus { SCHEDULED, CANCELED, SENT, FAILED }
