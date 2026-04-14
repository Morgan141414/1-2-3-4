package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.appointment.AddAppointmentProcedureRequest
import kz.saphena.api.service.AppointmentProcedureService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/appointment-procedures")
class AppointmentProcedureController(
    private val appointmentProcedureService: AppointmentProcedureService
) {

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_DOCTOR', 'ROLE_PATIENT')")
    fun getAppointmentProcedures(
        @RequestParam(required = true)
        appointmentId: UUID
    ) = appointmentProcedureService.getAppointmentProcedures(appointmentId)

    @PostMapping
    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    fun addProcedureToAppointment(
        @RequestParam(required = true)
        appointmentId: UUID,
        @RequestBody @Valid
        request: AddAppointmentProcedureRequest
    ) = appointmentProcedureService.addProcedureToAppointment(appointmentId, request)

    @PutMapping("{id}/close")
    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    fun closeAppointmentProcedure(
        @PathVariable id: UUID
    ) = appointmentProcedureService.closeAppointmentProcedure(id)

}