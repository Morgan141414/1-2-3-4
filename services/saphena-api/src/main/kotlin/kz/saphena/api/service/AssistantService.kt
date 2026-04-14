package kz.saphena.api.service

import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.dto.assistant.CreateAssistantRequest
import kz.saphena.api.dto.assistant.AssistantResponse
import kz.saphena.api.dto.PageResponse
import kz.saphena.api.dto.assistant.UpdateAssistantRequest
import kz.saphena.api.model.assistant.Assistant
import kz.saphena.api.model.assistant.AssistantType
import kz.saphena.api.model.user.UserRoleType
import kz.saphena.api.repository.AssistantRepository
import kz.saphena.api.repository.doctor.DoctorAssistantRepository
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class AssistantService(
    private val assistantRepository: AssistantRepository,
    private val userService: UserService,
    private val doctorAssistantRepository: DoctorAssistantRepository,
) {

    fun getAssistants(type: AssistantType?,
                      pageable: Pageable): PageResponse<AssistantResponse> {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        return assistantRepository.findByOrganizationId(myOrgId, type, pageable)
            .map {
                AssistantResponse(
                    id = it.getIdSafely(),
                    types = it.types,
                    firstName = it.firstName,
                    lastName = it.lastName,
                    middleName = it.middleName,
                    deleted = it.deleted,
                )
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

    fun getAssistant(id: UUID): AssistantResponse {
        return assistantRepository.findByIdOrNull(id)?.let {
            AssistantResponse(
                id = it.getIdSafely(),
                types = it.types,
                firstName = it.firstName,
                lastName = it.lastName,
                middleName = it.middleName,
                deleted = it.deleted,
            )
        } ?: throw EntityNotFoundException("Assistant Not Found")
    }

    @Transactional
    fun createAssistant(request: CreateAssistantRequest) {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()
        val user = userService.createUser(
            request.user,
            UserRoleType.ASSISTANT,
            false
        )

        assistantRepository.save(
            Assistant(
                user = user,
                organizationId = myOrgId,
                types = request.types,
                firstName = request.firstName.trim(),
                lastName = request.lastName.trim(),
                middleName = request.middleName?.trim()
            )
        )
    }

    fun updateAssistant(id: UUID,
                        request: UpdateAssistantRequest
    ) {
        val assistant = assistantRepository.findByIdOrNull(id) ?: throw EntityNotFoundException("Assistant Not Found")

        assistantRepository.save(
            assistant.also {
                it.firstName = request.firstName.trim()
                it.lastName = request.lastName.trim()
                it.middleName = request.middleName?.trim()
                it.types = request.types
            }
        )
    }

    fun getAssistantList(type: AssistantType): List<AssistantResponse> {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        return assistantRepository.findAllByOrganizationId(myOrgId, type)
            .map {
                AssistantResponse(
                    id = it.getIdSafely(),
                    types = it.types,
                    firstName = it.firstName,
                    lastName = it.lastName,
                    middleName = it.middleName,
                    deleted = it.deleted,
                )
            }
    }

    @Transactional
    fun deleteAssistant(id: UUID) {
        val assistant = assistantRepository.findByIdOrNull(id) ?: throw EntityNotFoundException("Assistant Not Found")

        assistantRepository.save(
            assistant.also {
                it.markDeleted()
            }
        )

        doctorAssistantRepository.deleteAllByAssistantId(id)
    }

    fun activateAssistant(id: UUID) {
        val assistant = assistantRepository.findByIdOrNull(id) ?: throw EntityNotFoundException("Assistant Not Found")

        assistantRepository.save(
            assistant.also {
                it.deleted = false
            }
        )
    }
}