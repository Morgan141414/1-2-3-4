package kz.saphena.api.dto.user

import kz.saphena.api.model.user.UserRoleType
import java.util.UUID

data class UserResponse(
    val id: UUID,
    val username: String,
    val role: UserRoleType
)
