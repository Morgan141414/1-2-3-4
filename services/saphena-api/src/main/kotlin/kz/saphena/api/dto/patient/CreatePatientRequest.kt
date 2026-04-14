package kz.saphena.api.dto.patient

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import kz.saphena.api.model.patient.GenderType
import kz.saphena.api.model.patient.Kato
import kz.saphena.api.model.patient.PatientDocumentType
import java.time.LocalDate

data class CreatePatientRequest(
    @get:NotNull
    val isCitizen: Boolean,
    val iin: String?,
    @get:NotBlank
    val firstName: String,
    @get:NotBlank
    val lastName: String,
    val middleName: String?,
    @get:NotNull
    val gender: GenderType,
    val birthdate: LocalDate,
    val city: Kato?,
    val address: String?,
    val phone: String?,
    val emergencyContact: String?,
    val email: String?,
    val documentType: PatientDocumentType?,
    val documentNumber: String?,
    val issuedAt: LocalDate?,
    val expiresAt: LocalDate?,
)