package kz.saphena.api.dto.doctor

import kz.saphena.api.dto.assistant.AssistantResponse
import java.util.UUID

data class DoctorAssistantResponse (
    val id: UUID,
    val assistant: AssistantResponse
)