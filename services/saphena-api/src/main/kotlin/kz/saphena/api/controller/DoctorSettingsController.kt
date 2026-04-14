package kz.saphena.api.controller

import jakarta.validation.Valid
import java.util.UUID
import kz.saphena.api.dto.doctor.DoctorSettingsRequest
import kz.saphena.api.service.DoctorSettingsService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/doctor-settings")
class DoctorSettingsController(
    private val doctorSettingsService: DoctorSettingsService
) {

    @GetMapping("{doctorId}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun getDoctorSettings(
        @PathVariable doctorId: UUID
    ) = doctorSettingsService.getDoctorSettings(doctorId)

    @PostMapping("{doctorId}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun createOrUpdateDoctorSettings(
        @PathVariable doctorId: UUID,
        @RequestBody @Valid request: DoctorSettingsRequest
    ) = doctorSettingsService.createOrUpdateDoctorSettings(doctorId, request)

    @DeleteMapping("{doctorId}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun deleteDoctorSettings(
        @PathVariable doctorId: UUID
    ) = doctorSettingsService.deleteDoctorSettings(doctorId)
}
