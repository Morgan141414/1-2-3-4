package kz.saphena.api.service

import jakarta.persistence.EntityExistsException
import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.dto.procedure.CreateProcedureRequest
import kz.saphena.api.dto.specialization.CreateSpecializationRequest
import kz.saphena.api.dto.specialization.SpecializationResponse
import kz.saphena.api.dto.specialization.toSpecializationResponse
import kz.saphena.api.model.procedure.ProcedureType
import kz.saphena.api.model.specialization.Specialization
import kz.saphena.api.repository.specialization.SpecializationRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class SpecializationService(
    private val specializationRepository: SpecializationRepository,
    private val procedureService: ProcedureService
) {

    fun getSpecializations(): List<SpecializationResponse> {
        return specializationRepository.findAll()
            .map { it.toSpecializationResponse() }
    }

    fun getSpecialization(id: UUID): SpecializationResponse {
        return specializationRepository.findByIdOrNull(id)
            ?.toSpecializationResponse()
            ?: throw EntityNotFoundException("Specialization Not Found")
    }

    @Transactional
    fun createSpecialization(request: CreateSpecializationRequest) {
        if (specializationRepository.existsByName(request.name.trim())) {
            throw EntityExistsException("Specialization already exists")
        }

        val specialization = specializationRepository.save(
            Specialization(
                name = request.name.trim()
            )
        )

        procedureService.createProcedure(
            specialization.getIdSafely(),
            CreateProcedureRequest(
                name = "Консультация",
                nameKk = "Кеңес беру",
                nameEn = "Consultation",
                type = ProcedureType.DEFAULT,
                key = "CONSULTATION",
            )
        )
    }

    fun updateSpecialization(id: UUID,
                             request: CreateSpecializationRequest
    ) {
        val specialization = specializationRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Specialization Not Found")

        specializationRepository.save(
            specialization.also {
                it.name = request.name.trim()
            }
        )
    }

    fun deleteSpecialization(id: UUID) {
        specializationRepository.deleteById(id)
    }

    fun restoreSpecialization(id: UUID) {
        val specialization = specializationRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Specialization Not Found")

        specializationRepository.save(
            specialization.also {
                it.restore()
            }
        )
    }

    fun getSpecializationCatalog(): List<SpecializationResponse> {
        return specializationRepository.findActiveSpecializations()
            .map { it.toSpecializationResponse() }
    }

}
