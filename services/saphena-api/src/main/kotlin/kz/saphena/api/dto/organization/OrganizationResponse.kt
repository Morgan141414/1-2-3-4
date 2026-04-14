package kz.saphena.api.dto.organization

import kz.saphena.api.model.organization.Organization
import java.util.*

data class OrganizationResponse(
    val id: UUID,
    val clinicName: String,
    val organizationName: String,
    val address: String,
    val phone: String,
    val email: String,
    val bin: String?,
)

fun Organization.toOrganizationResponse() = OrganizationResponse(
    id = getIdSafely(),
    clinicName = clinicName,
    organizationName = organizationName,
    address = address,
    phone = phone,
    email = email,
    bin = bin,
)