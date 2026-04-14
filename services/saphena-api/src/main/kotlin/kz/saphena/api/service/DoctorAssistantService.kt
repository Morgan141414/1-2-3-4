package kz.saphena.api.service

import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.dto.assistant.AssistantResponse
import kz.saphena.api.dto.doctor.AddDoctorAssistantRequest
import kz.saphena.api.dto.doctor.DoctorAssistantResponse
import kz.saphena.api.model.doctor.DoctorAssistant
import kz.saphena.api.repository.*
import kz.saphena.api.repository.doctor.DoctorAssistantRepository
import kz.saphena.api.repository.organization.OrganizationUserRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class DoctorAssistantService(
    private val doctorAssistantRepository: DoctorAssistantRepository,
    private val assistantRepository: AssistantRepository,
    private val organizationUserRepository: OrganizationUserRepository
) {

    fun getDoctorAssistants(orgUserId: UUID): List<DoctorAssistantResponse> {
        return doctorAssistantRepository.findByOrgUserId(orgUserId)
            .map {
                DoctorAssistantResponse(
                    id = it.getIdSafely(),
                    assistant = AssistantResponse(
                        id = it.assistant.getIdSafely(),
                        types = it.assistant.types,
                        firstName = it.assistant.firstName,
                        lastName = it.assistant.lastName,
                        middleName = it.assistant.middleName,
                        deleted = it.deleted,
                    )
                )
            }
    }

    fun addDoctorAssistant(request: AddDoctorAssistantRequest) {
        val assistant = assistantRepository.getReferenceById(request.assistantId)
        val orgUser = organizationUserRepository.getReferenceById(request.orgUserId)

        doctorAssistantRepository.save(
            DoctorAssistant(
                doctorId = request.doctorId,
                assistant = assistant,
                orgUser = orgUser
            )
        )
    }

    fun removeDoctorAssistant(id: UUID) {
        doctorAssistantRepository.deleteById(id)
    }

}