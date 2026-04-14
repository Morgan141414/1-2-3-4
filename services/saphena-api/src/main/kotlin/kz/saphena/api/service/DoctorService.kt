package kz.saphena.api.service

import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.dto.PageResponse
import kz.saphena.api.dto.doctor.CreateDoctorRequest
import kz.saphena.api.dto.doctor.DoctorResponse
import kz.saphena.api.dto.doctor.UpdateDoctorRequest
import kz.saphena.api.dto.doctor.toDoctorResponse
import kz.saphena.api.model.doctor.Doctor
import kz.saphena.api.model.organization.OrganizationUser
import kz.saphena.api.model.user.UserRoleType
import kz.saphena.api.repository.*
import kz.saphena.api.repository.doctor.DoctorRepository
import kz.saphena.api.repository.organization.OrganizationRepository
import kz.saphena.api.repository.organization.OrganizationUserRepository
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.util.*

@Service
class DoctorService(
    private val userService: UserService,
    private val doctorRepository: DoctorRepository,
    private val organizationUserRepository: OrganizationUserRepository,
    private val userRepository: UserRepository,
    private val organizationRepository: OrganizationRepository,
    private val meService: MeService
) {

    fun getDoctors(pageable: Pageable): PageResponse<DoctorResponse> {
        if (meService.me().role == UserRoleType.SUPERADMIN) {
            return doctorRepository.findDoctors(pageable)
                .map { it.toDoctorResponse(null) }
                .let {
                    PageResponse(
                        content = it.content,
                        totalPages = it.totalPages,
                        number = it.number,
                        last = it.isLast
                    )
                }
        }

        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        return doctorRepository.findByOrganizationId(myOrgId, pageable)
            .map {
                val orgUser = organizationUserRepository.findByUserIdAndOrganizationId(it.getIdSafely(), myOrgId)
                    ?: throw EntityNotFoundException("Organization User Not Found")
                it.toDoctorResponse(orgUser.getIdSafely())
            }
            .let {
                PageResponse(
                    content = it.content,
                    totalPages = it.totalPages,
                    number = it.number,
                    last = it.isLast
                )
            }
    }

    fun getDoctor(id: UUID): DoctorResponse {
        if (meService.me().role == UserRoleType.SUPERADMIN) {
            return doctorRepository.findByIdOrNull(id)
                ?.toDoctorResponse(null)
                ?: throw EntityNotFoundException("Doctor Not Found")
        }

        val myOrgId = OrganizationContext.getCurrentOrganizationId()
        val doctorOrgUser = organizationUserRepository.findByUserIdAndOrganizationId(id, myOrgId)
            ?: throw EntityNotFoundException("Organization User Not Found")

        return doctorRepository.findByIdOrNull(id)
            ?.toDoctorResponse(doctorOrgUser.getIdSafely(), true)
            ?: throw EntityNotFoundException("Doctor Not Found")
    }

    @Transactional
    fun createDoctor(request: CreateDoctorRequest) {
        val user = userService.createUser(request.user, UserRoleType.DOCTOR)
        doctorRepository.save(
            Doctor(
                user = user,
                iin = request.iin,
                firstName = request.firstName.trim(),
                lastName = request.lastName.trim(),
                middleName = request.middleName?.trim(),
                phone = request.phone,
                email = request.email
            )
        )
    }

    fun updateDoctor(id: UUID, request: UpdateDoctorRequest) {
        val doctor = doctorRepository.findByIdOrNull(id) ?: throw EntityNotFoundException("Doctor Not Found")

        doctorRepository.save(
            doctor.also {
                it.firstName = request.firstName.trim()
                it.lastName = request.lastName.trim()
                it.middleName = request.middleName?.trim()
                it.phone = request.phone
                it.email = request.email
            }
        )
    }

    fun removeDoctorFromOrganization(orgUserId: UUID) {
        val orgUser = organizationUserRepository.findByIdOrNull(orgUserId)
            ?: throw EntityNotFoundException("Organization Not Found")

        organizationUserRepository.save(
            orgUser.also {
                it.markDeleted()
            }
        )
    }

    fun getDoctorList(specializationId: UUID): List<DoctorResponse> {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        return doctorRepository.findAllByOrganizationIdAndSpecializationId(myOrgId, specializationId)
            .map {
                it.toDoctorResponse(null)
            }
    }

    fun getDoctorByIin(iin: String): DoctorResponse? {
        return doctorRepository.findByIin(iin)
            ?.toDoctorResponse(null, true)
    }

    fun addDoctorToOrganization(id: UUID) {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        val orgUser = organizationUserRepository.findByUserIdAndOrganizationId(id, myOrgId)

        if (orgUser != null && !orgUser.deleted) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Doctor Already Exists")
        } else if (orgUser != null) {
            organizationUserRepository.save(
                orgUser.also {
                    it.deleted = false
                }
            )
        } else {
            val user = userRepository.findByIdOrNull(id)
                ?: throw EntityNotFoundException("User Not Found")
            val organization = organizationRepository.findByIdOrNull(myOrgId)
                ?: throw EntityNotFoundException("Organization Not Found")

            organizationUserRepository.save(
                OrganizationUser(user, organization)
            )
        }
    }

}
