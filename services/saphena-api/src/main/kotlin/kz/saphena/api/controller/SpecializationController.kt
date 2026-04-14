package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.specialization.CreateSpecializationRequest
import kz.saphena.api.service.SpecializationService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/specializations")
class SpecializationController(
    private val specializationService: SpecializationService
) {

    @GetMapping
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun getSpecializations() = specializationService.getSpecializations()

    @PostMapping
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun createSpecialization(
        @RequestBody @Valid
        request: CreateSpecializationRequest
    ) = specializationService.createSpecialization(request)

    @GetMapping("{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPERADMIN', 'ROLE_DOCTOR')")
    fun getSpecialization(
        @PathVariable id: UUID
    ) = specializationService.getSpecialization(id)

    @PutMapping("{id}")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun updateSpecialization(
        @PathVariable id: UUID,
        @RequestBody @Valid
        request: CreateSpecializationRequest
    ) = specializationService.updateSpecialization(id, request)

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun deleteSpecialization(
        @PathVariable id: UUID
    ) = specializationService.deleteSpecialization(id)

    @PatchMapping("{id}/restore")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun restoreSpecialization(
        @PathVariable id: UUID
    ) = specializationService.restoreSpecialization(id)

    @GetMapping("catalog")
    fun getSpecializationCatalog() = specializationService.getSpecializationCatalog()

}
