package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.doctor.AddDoctorSpecializationRequest
import kz.saphena.api.service.DoctorSpecializationService
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/doctor-specializations")
class DoctorSpecializationController(
    private val doctorSpecializationService: DoctorSpecializationService
) {
    private val logger = LoggerFactory.getLogger(DoctorSpecializationController::class.java)

    @GetMapping
    fun getDoctorSpecializations(
        @RequestParam(required = true) orgUserId: UUID
    ) = run {
        logger.info("Fetching doctor specializations for orgUserId={}", orgUserId)
        doctorSpecializationService.getDoctorSpecializations(orgUserId)
    }

    @PostMapping
    fun addDoctorSpecialization(
        @RequestBody @Valid
        request: AddDoctorSpecializationRequest
    ) = run {
        logger.info(
            "Adding doctor specialization specializationId={}, orgUserId={}",
            request.specializationId,
            request.orgUserId,
        )
        doctorSpecializationService.addDoctorSpecialization(request)
    }

    @DeleteMapping("{id}")
    fun removeDoctorSpecialization(
        @PathVariable id: UUID
    ) = run {
        logger.info("Removing doctor specialization id={}", id)
        doctorSpecializationService.removeDoctorSpecialization(id)
    }

    @GetMapping("by-spec-id/{id}")
    fun getDoctorSpecializationsBySpecializationId(
        @PathVariable
        id: UUID,
    ) = run {
        logger.info("Fetching doctor specializations by specializationId={}", id)
        doctorSpecializationService.getDoctorSpecializationsBySpecializationId(id)
    }
}
