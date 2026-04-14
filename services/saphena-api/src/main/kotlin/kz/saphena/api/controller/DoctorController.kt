package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.doctor.CreateDoctorRequest
import kz.saphena.api.dto.doctor.UpdateDoctorRequest
import kz.saphena.api.service.DoctorService
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/doctors")
class DoctorController(
    private val doctorService: DoctorService
) {

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_SUPERADMIN', 'ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun getDoctors(
        @PageableDefault(sort = ["lastName"])
        pageable: Pageable
    ) = doctorService.getDoctors(pageable)

    @GetMapping("{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPERADMIN', 'ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun getDoctor(
        @PathVariable id: UUID
    ) = doctorService.getDoctor(id)

    @PostMapping
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun createDoctor(
        @RequestBody @Valid
        request: CreateDoctorRequest
    ) = doctorService.createDoctor(request)

    @PutMapping("{id}")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun updateDoctor(
        @PathVariable id: UUID,
        @RequestBody @Valid
        request: UpdateDoctorRequest
    ) = doctorService.updateDoctor(id, request)

    @DeleteMapping("{orgUserId}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun removeDoctorFromOrganization(
        @PathVariable orgUserId: UUID
    ) = doctorService.removeDoctorFromOrganization(orgUserId)

    @GetMapping("list")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_DOCTOR')")
    fun getDoctorList(
        @RequestParam(required = true) specializationId: UUID
    ) = doctorService.getDoctorList(specializationId)

    @GetMapping("iin/{iin}")
    fun getDoctorByIin(
        @PathVariable iin: String
    ) = doctorService.getDoctorByIin(iin)

    @PostMapping("{id}/add-to-organization")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun addDoctorToOrganization(
        @PathVariable id: UUID
    ) = doctorService.addDoctorToOrganization(id)

}