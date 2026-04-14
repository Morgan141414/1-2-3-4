package kz.saphena.api.service

import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.dto.patient.CreatePatientRequest
import kz.saphena.api.dto.patient.UpdatePatientRequest
import kz.saphena.api.dto.PageResponse
import kz.saphena.api.dto.patient.PatientResponse
import kz.saphena.api.dto.patient.toPatientResponse
import kz.saphena.api.model.patient.Patient
import kz.saphena.api.model.patient.PatientDocument
import kz.saphena.api.model.patient.PatientDocumentType
import kz.saphena.api.model.patient.PatientDocumentVerificationStatus
import kz.saphena.api.model.sms_challenge.SmsPurpose
import kz.saphena.api.repository.PatientDocumentRepository
import kz.saphena.api.repository.PatientRepository
import kz.saphena.api.service.sms.SmsChallengeService
import kz.saphena.api.utils.normalizePhoneDigitsOnly
import kz.saphena.api.utils.nullIfBlankTrimmed
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class PatientService(
    private val patientRepository: PatientRepository,
    private val patientDocumentRepository: PatientDocumentRepository,
    private val smsChallengeService: SmsChallengeService
) {
    fun getPatients(pageable: Pageable, search: String): PageResponse<PatientResponse> {
        return patientRepository.findPatients(pageable, search)
            .map {
                it.toPatientResponse()
            }
            .let {
                PageResponse(
                    content = it.content,
                    totalPages = it.totalPages,
                    number = it.number,
                    last = it.isLast
                )
            }
    }

    fun getPatient(id: UUID): PatientResponse {
        return patientRepository.findByIdOrNull(id)?.toPatientResponse()
            ?: throw EntityNotFoundException("Patient Not Found")
    }

    fun createPatient(request: CreatePatientRequest) {
        val patient = Patient(
            isCitizen = request.isCitizen,
            iin = request.iin
                ?.trim()
                ?.takeIf { it.isNotEmpty() },
            iinVerificationStatus = if (request.iin.isNullOrBlank()) {
                PatientDocumentVerificationStatus.NOT_PROVIDED
            } else {
                PatientDocumentVerificationStatus.PROVIDED
            },
            firstName = request.firstName.trim(),
            lastName = request.lastName.trim(),
            middleName = request.middleName
                ?.trim()
                ?.takeIf { it.isNotEmpty() },
            gender = request.gender,
            birthdate = request.birthdate,
            city = request.city,
            address = request.address
                ?.trim()
                ?.takeIf { it.isNotEmpty() },
            phone = request.phone
                ?.trim()
                ?.takeIf { it.isNotEmpty() },
            emergencyContact = request.emergencyContact
                ?.trim()
                ?.takeIf { it.isNotEmpty() },
            email = request.email
                ?.trim()
                ?.takeIf { it.isNotEmpty() }
        )

        if (request.documentType != null && request.documentNumber != null) {
            patient.addDocument(
                PatientDocument(
                    patient = patient,
                    type = request.documentType,
                    documentNumber = request.documentNumber.nullIfBlankTrimmed(),
                    issuedAt = request.issuedAt,
                    expiresAt = request.expiresAt,
                    isActive = true,
                    verificationStatus = PatientDocumentVerificationStatus.PROVIDED,
                )
            )
        }

        patientRepository.save(patient)
    }

    fun updatePatient(id: UUID, request: UpdatePatientRequest) {
        val patient = patientRepository.findByIdOrNull(id) ?: throw EntityNotFoundException("Patient Not Found")

        patientRepository.save(
            patient.also { p ->
                p.gender = request.gender
                p.firstName = request.firstName.trim()
                p.lastName = request.lastName.trim()
                p.middleName = request.middleName
                    ?.trim()
                    ?.takeIf { it.isNotEmpty() }
                p.birthdate = request.birthdate
                p.city = request.city
                p.address = request.address
                    ?.trim()
                    ?.takeIf { it.isNotEmpty() }
                p.phone = request.phone
                    ?.trim()
                    ?.takeIf { it.isNotEmpty() }
                p.emergencyContact = request.emergencyContact
                    ?.trim()
                    ?.takeIf { it.isNotEmpty() }
                p.email = request.email
                    ?.trim()
                    ?.takeIf { it.isNotEmpty() }
            }
        )
    }

    fun deletePatient(id: UUID) {
        patientRepository.deleteById(id)
    }

    fun checkPatientExistByIin(iin: String): Boolean {
        return patientRepository.existsByIin(iin)
    }

    fun checkPatientExistByDocNumber(docNumber: String,
                                     docType: PatientDocumentType): Boolean {
        return patientDocumentRepository.existsByTypeAndDocumentNumberAndIsActiveTrue(docType, docNumber)
    }

    @Transactional
    fun verifyPatient(id: UUID,
                      comment: String?) {
        val patient = patientRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Patient Not Found")

        if (patient.isCitizen) {
            patientRepository.save(
                patient.also {
                    it.iinVerificationStatus = PatientDocumentVerificationStatus.VERIFIED
                    it.verificationComment = comment
                }
            )
        } else {
            val patientDocument = patient.getActiveDocument()

            patientDocument?.also {
                it.verificationStatus = PatientDocumentVerificationStatus.VERIFIED
                it.verificationComment = comment
            }?.let {
                patientDocumentRepository.save(
                    it
                )
            }
        }
    }

    @Transactional
    fun rejectPatientVerification(id: UUID,
                                  comment: String?) {
        val patient = patientRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Patient Not Found")

        if (patient.isCitizen) {
            patientRepository.save(
                patient.also {
                    it.iinVerificationStatus = PatientDocumentVerificationStatus.REJECTED
                    it.verificationComment = comment
                }
            )
        } else {
            val patientDocument = patient.getActiveDocument()

            patientDocument?.also {
                it.verificationStatus = PatientDocumentVerificationStatus.REJECTED
                it.verificationComment = comment
            }?.let {
                patientDocumentRepository.save(
                    it
                )
            }
        }
    }

    @Transactional
    fun sendPhoneVerificationCode(
        id: UUID,
        phone: String,
    ) {
        val normalized = phone.normalizePhoneDigitsOnly()

        val patient = patientRepository.findByIdForUpdate(id)
            ?: throw EntityNotFoundException("Patient Not Found")

        val other = patientRepository.findByPhoneForUpdate(normalized)

        if (other != null && other.id != patient.id) {
            if (other.phoneVerified) {
                throw IllegalArgumentException("Phone already verified by another patient")
            }

            other.phone = null
            other.phoneVerified = false
            patientRepository.save(other)
        }

        patient.phone = normalized
        patient.phoneVerified = false
        patientRepository.save(patient)

        smsChallengeService.createAndSend(
            phoneRaw = normalized,
            purpose = SmsPurpose.PHONE_VERIFICATION
        )
    }

    @Transactional
    fun verifyPhone(
        id: UUID,
        code: String,
    ): Boolean {
        val patient = patientRepository.findByIdForUpdate(id)
            ?: throw EntityNotFoundException("Patient Not Found")

        val phone = patient.phone?.normalizePhoneDigitsOnly()
            ?: return false

        if (patient.phoneVerified) return true

        val verified = smsChallengeService.verify(phone, SmsPurpose.PHONE_VERIFICATION, code)
        if (!verified) return false

        patient.phoneVerified = true
        patientRepository.save(patient)
        return true
    }

}
