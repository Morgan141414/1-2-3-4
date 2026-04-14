package kz.saphena.api.dto.organization

import kz.saphena.api.dto.user.UserResponse
import java.util.UUID

data class OrganizationUserResponse(
    val id: UUID,
    val user: UserResponse
)