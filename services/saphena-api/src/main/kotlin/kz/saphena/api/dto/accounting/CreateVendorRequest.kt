package kz.saphena.api.dto.accounting

data class CreateVendorRequest(
    val bin: String,
    val name: String? = null,
    val contactPersonName: String? = null,
    val contactPersonPhone: String? = null
)
