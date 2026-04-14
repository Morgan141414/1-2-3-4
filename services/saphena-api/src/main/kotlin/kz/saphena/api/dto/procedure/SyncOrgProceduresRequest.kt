package kz.saphena.api.dto.procedure

import jakarta.validation.constraints.NotNull
import java.util.*

data class SyncOrgProceduresRequest(
    @get:NotNull
    val procedureIds: List<UUID>,
)
