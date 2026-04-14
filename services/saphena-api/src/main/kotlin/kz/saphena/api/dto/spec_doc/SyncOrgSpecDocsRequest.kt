package kz.saphena.api.dto.spec_doc

import jakarta.validation.constraints.NotNull
import java.util.UUID

data class SyncOrgSpecDocsRequest(
    @get:NotNull
    val specDocIds: List<UUID>,
)
