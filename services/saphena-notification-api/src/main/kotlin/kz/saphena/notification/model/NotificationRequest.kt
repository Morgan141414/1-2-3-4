package kz.saphena.notification.model

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import kz.saphena.notification.domain.NotificationType

data class NotificationRequest(
    @field:NotBlank
    val recipient: String,

    @field:NotBlank
    val message: String,

    @field:NotNull
    val type: NotificationType,

    val metadata: Map<String, Any>? = null
)
