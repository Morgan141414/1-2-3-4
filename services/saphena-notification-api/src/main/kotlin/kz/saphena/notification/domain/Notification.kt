package kz.saphena.notification.domain

import jakarta.persistence.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document(collection = "notifications")
data class Notification(
    @Id
    val id: String? = null,

    val message: String,

    @Indexed
    val recipient: String, // Phone number with WhatsApp

    val type: NotificationType,

    val metadata: Map<String, Any>? = mapOf(),

    @Indexed
    val status: NotificationStatus = NotificationStatus.PENDING,

    val createdAt: LocalDateTime = LocalDateTime.now(),

    var sentAt: LocalDateTime? = null,

    var deliveredAt: LocalDateTime? = null,

    var readAt: LocalDateTime? = null,

    var errorMessage: String? = null,

    var retryCount: Int = 0,

    var whatsappMessageId: String? = null
)

enum class NotificationStatus {
    PENDING, SENT, DELIVERED, READ, FAILED
}

enum class NotificationType {
    ALERT, REMINDER, MARKETING, TRANSACTION, VERIFICATION
}
