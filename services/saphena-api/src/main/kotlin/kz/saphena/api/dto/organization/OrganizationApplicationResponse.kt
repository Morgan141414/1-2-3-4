package kz.saphena.api.dto.organization

import kz.saphena.api.model.organization.OrganizationApplication
import kz.saphena.api.model.organization.OrganizationApplicationStatus
import java.time.LocalDateTime
import java.util.UUID

data class OrganizationApplicationResponse(
    val id: UUID,
    val clinicName: String,
    val organizationName: String,
    val address: String,
    val phone: String,
    val email: String,
    val bin: String,
    val applicantFullName: String,
    val applicantIin: String,
    val comment: String?,
    val status: OrganizationApplicationStatus,
    val moderationComment: String?,
    val organizationId: UUID?,
    val createdAt: LocalDateTime?,
    val moderatedAt: LocalDateTime?,
)

fun OrganizationApplication.toOrganizationApplicationResponse() = OrganizationApplicationResponse(
    id = getIdSafely(),
    clinicName = clinicName,
    organizationName = organizationName,
    address = address,
    phone = phone,
    email = email,
    bin = bin,
    applicantFullName = applicantFullName,
    applicantIin = applicantIin,
    comment = comment,
    status = status,
    moderationComment = moderationComment,
    organizationId = organization?.id,
    createdAt = createdAt,
    moderatedAt = moderatedAt,
)
