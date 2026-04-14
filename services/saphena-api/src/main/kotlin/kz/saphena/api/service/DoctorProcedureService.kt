package kz.saphena.api.service

import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.dto.doctor.AddDoctorProcedureRequest
import kz.saphena.api.dto.doctor.DoctorProcedureResponse
import kz.saphena.api.dto.doctor.toDoctorProcedureResponse
import kz.saphena.api.model.doctor.DoctorProcedure
import kz.saphena.api.repository.doctor.DoctorProcedureRepository
import kz.saphena.api.repository.doctor.DoctorSpecializationRepository
import kz.saphena.api.repository.procedure.OrganizationProcedureRepository
import kz.saphena.api.repository.room.RoomProcedureRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.util.*

@Service
class DoctorProcedureService(
    private val doctorProcedureRepository: DoctorProcedureRepository,
    private val doctorSpecializationRepository: DoctorSpecializationRepository,
    private val organizationProcedureRepository: OrganizationProcedureRepository,
    private val roomProcedureRepository: RoomProcedureRepository
) {

    fun getDoctorProceduresDoctorIdAndSpecId(
        doctorId: UUID,
        specializationId: UUID,
    ): List<DoctorProcedureResponse> {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        return doctorProcedureRepository.findByDoctorIdAndOrganizationIdAndSpecializationId(
            doctorId = doctorId,
            organizationId = myOrgId,
            specializationId = specializationId,
        )
            .map {
                val roomIds = roomProcedureRepository.findByOrganizationProcedureId(
                    organizationProcedureId = it.organizationProcedure.getIdSafely(),
                )
                    .map { rp -> rp.roomId }

                it.toDoctorProcedureResponse(roomIds)
            }
    }

    fun getDoctorProceduresByDocSpecId(id: UUID): List<DoctorProcedureResponse> {
        return doctorProcedureRepository.findByDoctorSpecializationId(id)
            .map { it.toDoctorProcedureResponse(emptyList()) }
    }

    fun addDoctorProcedure(request: AddDoctorProcedureRequest) {
        val orgProcedure = organizationProcedureRepository.getReferenceById(request.orgProcedureId)
        val docSpec = doctorSpecializationRepository.getReferenceById(request.docSpecId)

        doctorProcedureRepository.save(
            DoctorProcedure(
                organizationProcedure = orgProcedure,
                doctorSpecialization = docSpec,
                price = request.price,
            )
        )
    }

    fun removeDoctorProcedure(id: UUID) {
        doctorProcedureRepository.deleteById(id)
    }

    fun updatePrice(id: UUID,
                    price: Number?) {
        val doctorProcedure = doctorProcedureRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Doctor Procedure Not Found")

        doctorProcedureRepository.save(
            doctorProcedure.also {
                it.price = price?.toInt()
            }
        )
    }
}