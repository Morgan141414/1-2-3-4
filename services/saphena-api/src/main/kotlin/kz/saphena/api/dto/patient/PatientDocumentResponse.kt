package kz.saphena.api.dto.patient

import kz.saphena.api.model.patient.PatientDocument
import kz.saphena.api.model.patient.PatientDocumentType
import kz.saphena.api.model.patient.PatientDocumentVerificationStatus
import java.time.LocalDate
import java.util.UUID

data class PatientDocumentResponse(
    val id: UUID,
    val type: PatientDocumentType,
    val documentNumber: String?,
    val issuedAt: LocalDate?,
    val expiresAt: LocalDate?,
    val isActive: Boolean,
    val verificationStatus: PatientDocumentVerificationStatus,
)

fun PatientDocument.toPatientDocumentResponse() = PatientDocumentResponse(
    id = getIdSafely(),
    type = type,
    documentNumber = documentNumber,
    issuedAt = issuedAt,
    expiresAt = expiresAt,
    isActive = isActive,
    verificationStatus = verificationStatus,
)
