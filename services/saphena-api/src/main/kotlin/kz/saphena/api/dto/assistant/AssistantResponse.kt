package kz.saphena.api.dto.assistant

import kz.saphena.api.model.assistant.AssistantType
import java.util.UUID

data class AssistantResponse (
    val id: UUID,
    val types: Set<AssistantType>,
    val firstName: String,
    val lastName: String,
    val middleName: String?,
    val deleted: Boolean
)