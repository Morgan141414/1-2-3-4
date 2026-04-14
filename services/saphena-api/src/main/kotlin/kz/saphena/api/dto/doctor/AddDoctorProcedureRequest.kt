package kz.saphena.api.dto.doctor

import jakarta.validation.constraints.NotNull
import java.util.UUID

data class AddDoctorProcedureRequest(
    @get:NotNull
    val orgProcedureId: UUID,
    @get:NotNull
    val docSpecId: UUID,
    val price: Int? = null
)