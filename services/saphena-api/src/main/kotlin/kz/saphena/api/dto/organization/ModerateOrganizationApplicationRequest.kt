package kz.saphena.api.dto.organization

import jakarta.validation.constraints.NotNull
import kz.saphena.api.model.organization.OrganizationApplicationStatus

data class ModerateOrganizationApplicationRequest(
    @get:NotNull
    val status: OrganizationApplicationStatus,
    val moderationComment: String? = null,
)
