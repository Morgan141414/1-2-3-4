package kz.saphena.api.service

import jakarta.persistence.EntityNotFoundException
import java.util.UUID
import kz.saphena.api.dto.doctor.DoctorSettingsRequest
import kz.saphena.api.dto.doctor.DoctorSettingsResponse
import kz.saphena.api.dto.doctor.toResponse
import kz.saphena.api.model.doctor.DoctorSettings
import kz.saphena.api.repository.doctor.DoctorSettingsRepository
import kz.saphena.api.repository.organization.OrganizationUserRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DoctorSettingsService(
    private val doctorSettingsRepository: DoctorSettingsRepository,
    private val organizationUserRepository: OrganizationUserRepository
) {

    fun getDoctorSettings(doctorOrganizationId: UUID): DoctorSettingsResponse? {
        return doctorSettingsRepository.findByDoctorOrganizationId(doctorOrganizationId)?.toResponse()
    }

    @Transactional
    fun createOrUpdateDoctorSettings(
        doctorId: UUID,
        request: DoctorSettingsRequest
    ): DoctorSettingsResponse {
        val orgUser = organizationUserRepository.findByIdOrNull(doctorId)
            ?: throw EntityNotFoundException("Doctor Not Found")

        val existing = doctorSettingsRepository.findByDoctorOrganizationId(doctorId)

        return if (existing != null) {
            doctorSettingsRepository.save(
                existing.apply {
                    doctorClientRatio = request.doctorClientRatio
                    clinicClientRatio = request.clinicClientRatio
                }
            ).toResponse()
        } else {
            doctorSettingsRepository.save(
                DoctorSettings(
                    doctorId = orgUser,
                    doctorClientRatio = request.doctorClientRatio,
                    clinicClientRatio = request.clinicClientRatio
                )
            ).toResponse()
        }
    }

    fun deleteDoctorSettings(doctorOrganizationId: UUID) {
        val settings = doctorSettingsRepository.findByDoctorOrganizationId(doctorOrganizationId)
            ?: throw EntityNotFoundException("Doctor Settings Not Found")

        doctorSettingsRepository.save(
            settings.apply {
                markDeleted()
            }
        )
    }
}
