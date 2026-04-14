package kz.saphena.api.dto.patient

import com.fasterxml.jackson.annotation.JsonFormat
import kz.saphena.api.model.patient.GenderType
import kz.saphena.api.model.patient.Kato
import kz.saphena.api.model.patient.Patient
import kz.saphena.api.model.patient.PatientDocumentType
import kz.saphena.api.model.patient.PatientDocumentVerificationStatus
import java.time.LocalDate
import java.util.UUID

data class PatientResponse(
    val id: UUID,
    val isCitizen: Boolean,
    val gender: GenderType,
    val iin: String?,
    val documentId: UUID?,
    val documentType: PatientDocumentType?,
    val documentNumber: String?,
    val issuedAt: LocalDate?,
    val expiresAt: LocalDate?,
    val verificationStatus: PatientDocumentVerificationStatus,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    var birthdate: LocalDate,
    val firstName: String,
    val lastName: String,
    val middleName: String?,
    val city: Kato?,
    val address: String?,
    val phone: String?,
    val phoneVerified: Boolean,
    val emergencyContact: String?,
    val email: String?,
)

fun Patient.toPatientResponse() = PatientResponse(
    id = getIdSafely(),
    isCitizen = isCitizen,
    iin = iin,
    documentId = getActiveDocument()?.getIdSafely(),
    documentType = getActiveDocument()?.type,
    documentNumber = getActiveDocument()?.documentNumber,
    issuedAt = getActiveDocument()?.issuedAt,
    expiresAt = getActiveDocument()?.expiresAt,
    verificationStatus = if (isCitizen) {
        iinVerificationStatus
    } else {
        getActiveDocument()?.verificationStatus ?: PatientDocumentVerificationStatus.NOT_PROVIDED
    },
    firstName = firstName,
    lastName = lastName,
    middleName = middleName,
    gender = gender,
    birthdate = birthdate,
    city = city,
    address = address,
    phone = phone,
    phoneVerified = phoneVerified,
    emergencyContact = emergencyContact,
    email = email,
)
