package kz.saphena.api.dto.notification

import jakarta.validation.constraints.NotBlank

data class NotificationRequest(
    @field:NotBlank
    val number: String,

    @field:NotBlank
    val message: String,

    val delay: Int,
)
