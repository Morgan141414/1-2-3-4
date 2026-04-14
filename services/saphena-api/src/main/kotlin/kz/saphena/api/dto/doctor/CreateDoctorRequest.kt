package kz.saphena.api.dto.doctor

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import kz.saphena.api.dto.user.CreateUserRequestRequest

data class CreateDoctorRequest(
    @get:NotNull
    val user: CreateUserRequestRequest,
    @get:NotBlank
    val iin: String,
    @get:NotBlank
    val firstName: String,
    @get:NotBlank
    val lastName: String,
    val middleName: String? = null,
    val phone: String? = null,
    val email: String? = null
)
