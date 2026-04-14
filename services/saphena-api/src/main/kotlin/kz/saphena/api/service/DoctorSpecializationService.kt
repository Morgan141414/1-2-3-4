package kz.saphena.api.service

import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.dto.doctor.AddDoctorSpecializationRequest
import kz.saphena.api.dto.doctor.DoctorResponse
import kz.saphena.api.dto.doctor.DoctorSpecializationResponse
import kz.saphena.api.dto.doctor.toDoctorResponse
import kz.saphena.api.dto.doctor.toDoctorSpecializationResponse
import kz.saphena.api.model.doctor.DoctorSpecialization
import kz.saphena.api.repository.doctor.DoctorProcedureRepository
import kz.saphena.api.repository.doctor.DoctorRepository
import kz.saphena.api.repository.doctor.DoctorSpecializationRepository
import kz.saphena.api.repository.organization.OrganizationUserRepository
import kz.saphena.api.repository.specialization.SpecializationRepository
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class DoctorSpecializationService(
    private val doctorSpecializationRepository: DoctorSpecializationRepository,
    private val specializationRepository: SpecializationRepository,
    private val doctorProcedureRepository: DoctorProcedureRepository,
    private val organizationUserRepository: OrganizationUserRepository,
    private val doctorRepository: DoctorRepository
) {
    private val logger = LoggerFactory.getLogger(DoctorSpecializationService::class.java)

    fun getDoctorSpecializations(orgUserId: UUID): List<DoctorSpecializationResponse> {
        logger.info("Request to get doctor specializations orgUserId={}", orgUserId)

        return doctorSpecializationRepository.findByOrgUserId(orgUserId)
            .map { it.toDoctorSpecializationResponse(null) }
    }

    fun addDoctorSpecialization(request: AddDoctorSpecializationRequest) {
        logger.info(
            "Request to add doctor specialization specializationId={}, orgUserId={}",
            request.specializationId,
            request.orgUserId
        )
        val specialization = specializationRepository.findByIdOrNull(request.specializationId)
            ?: throw EntityNotFoundException("Specialization Not Found")
        val orgUserId = organizationUserRepository.getReferenceById(request.orgUserId)

        doctorSpecializationRepository.save(
            DoctorSpecialization(
                orgUser = orgUserId,
                specialization = specialization,
            )
        )
    }

    @Transactional
    fun removeDoctorSpecialization(id: UUID) {
        logger.info("Request to remove doctor specialization id={}", id)

        doctorProcedureRepository.deleteAllByDoctorSpecializationId(id)

        doctorSpecializationRepository.deleteById(id)
    }

    fun getDoctorSpecializationsBySpecializationId(specializationId: UUID): List<DoctorSpecializationResponse> {
        logger.info("Request to get doctors by specialization specializationId={}", specializationId)
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        return doctorSpecializationRepository.findOrgUsersByOrganizationIdAndSpecializationId(
            organizationId = myOrgId,
            specializationId = specializationId,
        )
            .map {
                val doctor = doctorRepository.findByIdOrNull(it.orgUser.user.getIdSafely())
                    ?: throw EntityNotFoundException("Doctor Not Found")
                it.toDoctorSpecializationResponse(doctor)
            }
    }
}
