package kz.saphena.api.dto.doctor

import jakarta.validation.constraints.NotNull
import java.util.UUID

data class AddDoctorAssistantRequest(
    @get:NotNull
    val doctorId: UUID,
    @get:NotNull
    val assistantId: UUID,
    @get:NotNull
    val orgUserId: UUID
)
