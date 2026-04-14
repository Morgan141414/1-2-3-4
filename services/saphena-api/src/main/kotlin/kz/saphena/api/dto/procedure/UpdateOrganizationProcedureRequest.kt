package kz.saphena.api.dto.procedure

import jakarta.validation.constraints.NotNull
import java.util.UUID

data class UpdateOrganizationProcedureRequest(
    @get:NotNull
    val roomRequired: Boolean,
    @get:NotNull
    val roomIds: List<UUID>,
)
