package kz.saphena.api.dto.assistant

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import kz.saphena.api.dto.user.CreateUserRequestRequest
import kz.saphena.api.model.assistant.AssistantType

data class CreateAssistantRequest(
    @get:NotNull
    val user: CreateUserRequestRequest,
    @get:NotEmpty
    val types: MutableSet<AssistantType>,
    @get:NotBlank
    val firstName: String,
    @get:NotBlank
    val lastName: String,
    val middleName: String? = null
)
