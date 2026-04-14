package kz.saphena.api.dto.appointment

import jakarta.validation.constraints.NotNull
import kz.saphena.api.model.appointment.PaymentStatusType
import kz.saphena.api.model.appointment.PaymentType

data class UpdatePaymentStatusRequest(
    @get:NotNull
    val paymentType: PaymentType,
    @get:NotNull
    val paymentStatus: PaymentStatusType,
)
