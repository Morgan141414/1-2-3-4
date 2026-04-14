package kz.saphena.api.dto.assistant

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import kz.saphena.api.model.assistant.AssistantType

data class UpdateAssistantRequest(
    @get:NotEmpty
    val types: MutableSet<AssistantType>,
    @get:NotBlank
    val firstName: String,
    @get:NotBlank
    val lastName: String,
    val middleName: String? = null
)
