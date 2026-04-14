package kz.saphena.notification.model

import kz.saphena.notification.domain.NotificationStatus
import kz.saphena.notification.domain.NotificationType
import java.time.LocalDateTime

data class NotificationResponse(
    val id: String,
    val status: String,
    val recipient: String,
//    val type: NotificationType,
    val createdAt: LocalDateTime,
    val message: String,
//    val content: String?,
    val sentAt: LocalDateTime?
)