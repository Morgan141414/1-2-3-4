package kz.saphena.api.service

import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.dto.protocol.ProtocolDataResponse
import kz.saphena.api.events.AssistantParticipationEvent
import kz.saphena.api.events.DoctorServiceProvidedEvent
import kz.saphena.api.events.OperatorAppointmentCreatedEvent
import kz.saphena.api.events.ReceptionClientServedEvent
import kz.saphena.api.events.Assistant
import kz.saphena.api.model.appointment.Appointment
import kz.saphena.api.model.assistant.AssistantType
import kz.saphena.api.model.user.UserRoleType
import kz.saphena.api.repository.UserRepository
import kz.saphena.api.repository.audit.AuditEventEntityRepository
import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.util.UUID

@Service
class EventPublishingService(
    private val eventPublisher: ApplicationEventPublisher,
    private val appointmentProcedureService: AppointmentProcedureService,
    private val userRepository: UserRepository,
    private val auditEventEntityRepository: AuditEventEntityRepository,
) {
    private val logger = LoggerFactory.getLogger(EventPublishingService::class.java)

    fun publishProtocolDataEvents(protocolData: ProtocolDataResponse) {
        val organizationId = OrganizationContext.getCurrentOrganizationId()

        // Collect assistants from doctorAssistantId and protocol data fields
        val assistants = mutableListOf<Assistant>()
        protocolData.doctorAssistantId?.let {
            assistants.add(Assistant(assistantId = it, assistantType = AssistantType.DOCTOR_ASSISTANT))
        }
        val assistantsByType = extractAssistantIdsByType(protocolData)
        assistantsByType.forEach { (type, ids) ->
            ids.forEach { id -> assistants.add(Assistant(assistantId = id, assistantType = type)) }
        }

        val distinctAssistants = assistants.distinctBy { it.assistantId to it.assistantType }
        if (distinctAssistants.isEmpty()) {
            logger.info(
                "No assistants found in protocolData. Skipping AssistantParticipationEvent publishing: organizationId={}, appointmentId={}, protocolDataId={}",
                organizationId,
                protocolData.appointmentId,
                protocolData.id
            )
            return
        }

        logger.info(
            "Publishing AssistantParticipationEvent with {} assistants: organizationId={}, appointmentId={}, protocolDataId={}",
            distinctAssistants.size,
            organizationId,
            protocolData.appointmentId,
            protocolData.id
        )
        eventPublisher.publishEvent(
            AssistantParticipationEvent(
                organizationId = organizationId,
                assistants = distinctAssistants,
                appointmentId = protocolData.appointmentId!!,
                protocolDataId = protocolData.id
            )
        )
    }

    private fun extractAssistantIdsByType(protocolData: ProtocolDataResponse): Map<AssistantType, List<UUID>> {
        val sections = protocolData.data
        val pairs = sections
            .asSequence()
            .flatMap { it.fields.asSequence() }
            .filter { (it.assistantIds?.isNotEmpty() == true) && it.assistantType != null }
            .flatMap { field ->
                val type = field.assistantType!!
                field.assistantIds!!.asSequence().map { id -> type to id }
            }
            .toList()

        val grouped = pairs.groupBy({ it.first }, { it.second })
        // Ensure unique ids per type while preserving insertion order
        return grouped.mapValues { (_, ids) -> ids.distinct() }
    }


    fun publishAppointmentCreated(appointment: Appointment, createdBy: String) {
        logger.info("User '{}' created appointment id={}", createdBy, appointment.id)
        val user = userRepository.findByUsername(createdBy)

        if (user?.role == UserRoleType.OPERATOR) {
            logger.info("Publishing OperatorAppointmentCreatedEvent '{}'", appointment.id)
            eventPublisher.publishEvent(
                OperatorAppointmentCreatedEvent(
                    organizationId = appointment.organizationId,
                    operatorId = user.id!!,
                    appointmentId = appointment.id!!
                )
            )
        }
    }

    fun publishAppointmentClosed(appointment: Appointment, createdBy: String) {
        logger.info("User '{}' closed appointment id={}", createdBy, appointment.id)

        publishDoctorServiceProvidedEvent(appointment)

        publishReceptionClientServedEvent(appointment)
    }

    fun publishDoctorServiceProvidedEvent(appointment: Appointment) {
        val procedures = appointmentProcedureService.getAppointmentProcedures(appointment.getIdSafely())
        procedures.forEach { procedure ->
            eventPublisher.publishEvent(
                DoctorServiceProvidedEvent(
                    organizationId = appointment.organizationId,
                    doctorId = appointment.doctor.getIdSafely(),
                    appointmentId = appointment.getIdSafely(),
                    procedureId = procedure.id,
                    amount = procedure.actualPrice?.let { BigDecimal.valueOf(it) },
                    clientOwnership = appointment.clientOwnership
                )
            )
        }
    }

    fun publishReceptionClientServedEvent(appointment: Appointment) {
        val receptionists = userRepository.findByRole(UserRoleType.RECEPTIONIST)
        val receptionistOnDuty = auditEventEntityRepository.findTopByPrincipalInOrderByEventTimestampDesc(receptionists.map { it.username }).principal
        val receptionistId = receptionists
            .find { it.username == receptionistOnDuty }
            ?.id

        eventPublisher.publishEvent(
            ReceptionClientServedEvent(
                organizationId = appointment.organizationId,
                receptionistId = receptionistId!!,
                appointmentId = appointment.getIdSafely(),
            )
        )
    }
}
