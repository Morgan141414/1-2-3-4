package kz.saphena.api.dto.auth

import java.util.UUID

data class SignInResponse(
    val token: String,
    val username: String,
    val role: String,
    val organizationIds: List<UUID>
)