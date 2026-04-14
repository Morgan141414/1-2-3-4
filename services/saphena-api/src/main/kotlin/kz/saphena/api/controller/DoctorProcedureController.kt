package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.doctor.AddDoctorProcedureRequest
import kz.saphena.api.service.DoctorProcedureService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/doctor-procedures")
class DoctorProcedureController(
    private val doctorProcedureService: DoctorProcedureService
) {

    @GetMapping
    fun getDoctorProceduresDoctorIdAndSpecId(
        @RequestParam(required = true)
        doctorId: UUID,
        @RequestParam(required = true)
        specializationId: UUID
    ) = doctorProcedureService.getDoctorProceduresDoctorIdAndSpecId(
        doctorId = doctorId,
        specializationId = specializationId
    )

    @GetMapping("docSpecId/{id}")
    fun getDoctorProceduresByDocSpecId(
        @PathVariable
        id: UUID,
    ) = doctorProcedureService.getDoctorProceduresByDocSpecId(id)

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun addDoctorProcedure(
        @RequestBody @Valid
        request: AddDoctorProcedureRequest
    ) = doctorProcedureService.addDoctorProcedure(request)

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun removeDoctorProcedure(
        @PathVariable id: UUID
    ) = doctorProcedureService.removeDoctorProcedure(id)

    @PostMapping("{id}/price")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun updatePrice(
        @PathVariable id: UUID,
        @RequestBody price: Number?
    ) = doctorProcedureService.updatePrice(id, price)
}