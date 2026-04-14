package kz.saphena.notification.domain

import jakarta.persistence.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document(collection = "notification_templates")
data class NotificationTemplate(
    @Id
    val id: String? = null,

    @Indexed(unique = true)
    val templateName: String,

    val templateContent: String,

    val whatsappApproved: Boolean = false,

    val parameters: List<String> = listOf(),

    val createdAt: LocalDateTime = LocalDateTime.now(),

    var updatedAt: LocalDateTime = LocalDateTime.now()
)
