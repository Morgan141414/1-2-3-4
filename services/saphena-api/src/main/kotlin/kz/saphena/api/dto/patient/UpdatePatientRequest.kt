package kz.saphena.api.dto.patient

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import kz.saphena.api.model.patient.GenderType
import kz.saphena.api.model.patient.Kato
import java.time.LocalDate

data class UpdatePatientRequest(
    @get:NotNull
    val gender: GenderType,
    @get:NotBlank
    val firstName: String,
    val lastName: String,
    val middleName: String? = null,
    val birthdate: LocalDate,
    val city: Kato? = null,
    val address: String? = null,
    val phone: String? = null,
    val emergencyContact: String? = null,
    val email: String? = null
)