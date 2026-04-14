package kz.saphena.api.service

import jakarta.persistence.EntityExistsException
import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.dto.procedure.CreateProcedureRequest
import kz.saphena.api.dto.procedure.ProcedureResponse
import kz.saphena.api.dto.procedure.toProcedureResponse
import kz.saphena.api.model.procedure.Procedure
import kz.saphena.api.repository.procedure.ProcedureRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class ProcedureService(
    private val procedureRepository: ProcedureRepository,
) {

    fun getProcedures(specializationId: UUID): List<ProcedureResponse> {
        return procedureRepository.findAllBySpecializationId(specializationId)
            .map { it.toProcedureResponse() }
    }

    fun createProcedure(
        specializationId: UUID,
        request: CreateProcedureRequest,
    ) {
        if (procedureRepository.existsBySpecializationIdAndName(specializationId, request.name.trim())) {
            throw EntityExistsException("Procedure name already exists")
        }
        if (procedureRepository.existsBySpecializationIdAndKey(specializationId, request.key?.trim())) {
            throw EntityExistsException("Procedure key already exists")
        }

        procedureRepository.save(
            Procedure(
                name = request.name.trim(),
                specializationId = specializationId,
                type = request.type,
                key = request.key
                    ?.trim()
                    ?.takeIf { it.isNotEmpty() }
                    ?.uppercase(),
                nameKk = request.nameKk
                    ?.trim()
                    ?.takeIf { it.isNotEmpty() },
                nameEn = request.nameEn
                    ?.trim()
                    ?.takeIf { it.isNotEmpty() },
            )
        )
    }

    fun getProcedure(id: UUID): ProcedureResponse {
        return procedureRepository.findByIdOrNull(id)
            ?.toProcedureResponse()
            ?: throw EntityNotFoundException("Procedure Not Found")
    }

    fun updateProcedure(
        id: UUID,
        request: CreateProcedureRequest
    ) {
        val procedure = procedureRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Procedure Not Found")

        procedureRepository.save(
            procedure.also { p ->
                p.name = request.name.trim()
                p.nameKk = request.nameKk
                    ?.trim()
                    ?.takeIf { it.isNotEmpty() }
                p.nameEn = request.nameEn
                    ?.trim()
                    ?.takeIf { it.isNotEmpty() }
                p.type = request.type
                p.key = request.key
                    ?.trim()
                    ?.takeIf { str -> str.isNotEmpty() }
                    ?.uppercase()
            }
        )
    }

    fun deleteProcedure(id: UUID) {
        procedureRepository.deleteById(id)
    }

    fun restoreProcedure(id: UUID) {
        val procedure = procedureRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Procedure Not Found")

        procedureRepository.save(
            procedure.also {
                it.restore()
            }
        )
    }

    fun getProcedureCatalog(specializationId: UUID): List<ProcedureResponse> {
        return procedureRepository.findActiveProcedures(specializationId)
            .map { it.toProcedureResponse() }
    }

}
