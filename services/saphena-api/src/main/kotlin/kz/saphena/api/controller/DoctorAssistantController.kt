package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.doctor.AddDoctorAssistantRequest
import kz.saphena.api.service.DoctorAssistantService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/doctor-assistants")
class DoctorAssistantController(
    private val doctorAssistantService: DoctorAssistantService
) {

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_DOCTOR')")
    fun getDoctorAssistants(
        @RequestParam(required = true)
        orgUserId: UUID
    ) = doctorAssistantService.getDoctorAssistants(orgUserId)

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun addAssistantToDoctor(
        @RequestBody @Valid
        request: AddDoctorAssistantRequest
    ) = doctorAssistantService.addDoctorAssistant(request)

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun removeDoctorAssistant(
        @PathVariable id: UUID
    ) = doctorAssistantService.removeDoctorAssistant(id)

}