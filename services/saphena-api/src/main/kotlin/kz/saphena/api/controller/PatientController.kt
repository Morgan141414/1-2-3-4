package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.patient.CreatePatientRequest
import kz.saphena.api.dto.patient.UpdatePatientRequest
import kz.saphena.api.model.patient.PatientDocumentType
import kz.saphena.api.service.PatientService
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/patients")
class PatientController(
    private val patientService: PatientService
) {
    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_DOCTOR', 'ROLE_OPERATOR', 'ROLE_RECEPTIONIST', 'ROLE_SUPERADMIN')")
    fun getPatients(
        @PageableDefault(sort = ["lastName"])
        pageable: Pageable,
        @RequestParam search: String
    ) = patientService.getPatients(pageable, search)

    @GetMapping("{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_DOCTOR', 'ROLE_OPERATOR', 'ROLE_RECEPTIONIST', 'ROLE_SUPERADMIN')")
    fun getPatient(
        @PathVariable id: UUID
    ) = patientService.getPatient(id)

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_DOCTOR', 'ROLE_OPERATOR', 'ROLE_RECEPTIONIST', 'ROLE_SUPERADMIN')")
    fun createPatient(
        @RequestBody @Valid
        request: CreatePatientRequest
    ) = patientService.createPatient(request)

    @PutMapping("{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPERADMIN')")
    fun updatePatient(
        @PathVariable id: UUID,
        @RequestBody @Valid
        request: UpdatePatientRequest
    ) = patientService.updatePatient(id, request)

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPERADMIN')")
    fun deletePatient(
        @PathVariable id: UUID
    ) = patientService.deletePatient(id)

    @GetMapping("iin/{iin}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_DOCTOR', 'ROLE_OPERATOR', 'ROLE_RECEPTIONIST', 'ROLE_SUPERADMIN')")
    fun checkPatientExistByIin(
        @PathVariable iin: String
    ) = patientService.checkPatientExistByIin(iin)

    @GetMapping("doc-number")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_DOCTOR', 'ROLE_OPERATOR', 'ROLE_RECEPTIONIST', 'ROLE_SUPERADMIN')")
    fun checkPatientExistByDocNumber(
        @RequestParam(name = "number", required = true)
        docNumber: String,
        @RequestParam(name = "type", required = true)
        docType: PatientDocumentType
    ) = patientService.checkPatientExistByDocNumber(docNumber, docType)

    @PostMapping("/{id}/verify")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_DOCTOR', 'ROLE_RECEPTIONIST', 'ROLE_SUPERADMIN')")
    fun verifyPatient(
        @PathVariable
        id: UUID,
        @RequestParam
        comment: String?,
    ) = patientService.verifyPatient(
        id = id,
        comment = comment,
    )

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_DOCTOR', 'ROLE_RECEPTIONIST', 'ROLE_SUPERADMIN')")
    fun rejectPatientVerification(
        @PathVariable
        id: UUID,
        @RequestParam
        comment: String?,
    ) = patientService.rejectPatientVerification(
        id = id,
        comment = comment,
    )

    @PostMapping("/{id}/phone-verification/send")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_DOCTOR', 'ROLE_RECEPTIONIST', 'ROLE_SUPERADMIN')")
    fun sendPhoneVerificationCode(
        @PathVariable
        id: UUID,
        @RequestParam(required = true)
        phone: String
    ) = patientService.sendPhoneVerificationCode(
        id = id,
        phone = phone,
    )

    @PostMapping("/{id}/phone-verification/verify")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_DOCTOR', 'ROLE_RECEPTIONIST', 'ROLE_SUPERADMIN')")
    fun verifyPhone(
        @PathVariable
        id: UUID,
        @RequestParam(required = true)
        code: String,
    ) = patientService.verifyPhone(
        id = id,
        code = code,
    )

}
