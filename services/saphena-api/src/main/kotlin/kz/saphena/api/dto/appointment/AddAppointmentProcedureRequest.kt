package kz.saphena.api.dto.appointment

import jakarta.validation.constraints.NotNull
import java.util.UUID

data class AddAppointmentProcedureRequest(
    @get:NotNull
    val procedureId: UUID,
    val actualPrice: Long?
)
