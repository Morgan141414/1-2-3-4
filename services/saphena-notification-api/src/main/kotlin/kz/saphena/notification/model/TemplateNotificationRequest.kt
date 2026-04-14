package kz.saphena.notification.model

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import kz.saphena.notification.domain.NotificationType

class TemplateNotificationRequest(
    @field:NotBlank
    val recipient: String,

    @field:NotBlank
    val templateId: String,

    @field:NotBlank
    val templateName: String,

    @field:NotNull
    val type: NotificationType,

    val templateVariables: Map<String, String> = emptyMap(),

    val metadata: Map<String, Any>? = null

)
