package kz.saphena.api.dto.accounting

import kz.saphena.api.model.accounting.Vendor
import java.util.UUID

data class VendorResponse(
    val id: UUID,
    val bin: String,
    val name: String?,
    val contactPersonName: String?,
    val contactPersonPhone: String?
)

fun Vendor.toResponse() = VendorResponse(
    id = getIdSafely(),
    bin = bin,
    name = name,
    contactPersonName = contactPersonName,
    contactPersonPhone = contactPersonPhone
)
