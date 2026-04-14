package kz.saphena.api.dto.doctor

import jakarta.validation.constraints.NotNull
import java.util.UUID

data class AddDoctorSpecializationRequest(
    @get:NotNull
    val specializationId: UUID,
    @get:NotNull
    val orgUserId: UUID
)
