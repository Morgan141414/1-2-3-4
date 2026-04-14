package kz.saphena.api.dto.doctor

import jakarta.validation.constraints.NotBlank

data class UpdateDoctorRequest(
    @get:NotBlank
    val firstName: String,
    @get:NotBlank
    val lastName: String,
    val middleName: String? = null,
    val phone: String? = null,
    val email: String? = null
)
