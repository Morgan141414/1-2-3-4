package kz.saphena.api.events

import kz.saphena.api.model.appointment.ClientOwnershipType
import kz.saphena.api.model.kpi.KpiEvent
import kz.saphena.api.model.kpi.KpiEventType
import kz.saphena.api.model.user.UserRoleType
import kz.saphena.api.repository.kpi.KpiEventRepository
import org.slf4j.LoggerFactory
import org.springframework.context.event.EventListener
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class KpiEventListener(
    private val kpiEventRepository: KpiEventRepository
) {

    private val log = LoggerFactory.getLogger(javaClass)

    @Async
    @EventListener
    fun onOperatorAppointmentCreated(event: OperatorAppointmentCreatedEvent) {
        log.info("Received OperatorAppointmentCreatedEvent: organizationId={}, operatorId={}, appointmentId={}", event.organizationId, event.operatorId, event.appointmentId)
        val saved = kpiEventRepository.save(
            KpiEvent(
                organizationId = event.organizationId,
                userId = event.operatorId,
                userRole = UserRoleType.OPERATOR,
                eventType = KpiEventType.OPERATOR_APPOINTMENT_CREATED,
                clientOwnershipType = ClientOwnershipType.CLINIC,
                appointmentId = event.appointmentId,
                procedureId = null,
                protocolDataId = null,
                amount = null,
                assistantType = null
            )
        )
        log.debug("Saved KPI event for operator appointment created: kpiEventId={}", saved.id)
    }

    @Async
    @EventListener
    fun onDoctorServiceProvided(event: DoctorServiceProvidedEvent) {
        log.info("Received DoctorServiceProvidedEvent: organizationId={}, doctorId={}, appointmentId={}, procedureId={}, amount={}", event.organizationId, event.doctorId, event.appointmentId, event.procedureId, event.amount)
        val saved = kpiEventRepository.save(
            KpiEvent(
                organizationId = event.organizationId,
                userId = event.doctorId,
                userRole = UserRoleType.DOCTOR,
                eventType = KpiEventType.DOCTOR_SERVICE_PROVIDED,
                clientOwnershipType = event.clientOwnership,
                appointmentId = event.appointmentId,
                procedureId = event.procedureId,
                protocolDataId = null,
                amount = event.amount,
                assistantType = null
            )
        )
        log.debug("Saved KPI event for doctor service provided: kpiEventId={}", saved.id)
    }

    @Async
    @EventListener
    @Transactional
    fun onAssistantParticipation(event: AssistantParticipationEvent) {
        log.info(
            "Received AssistantParticipationEvent: organizationId={}, assistantsCount={}, appointmentId={}, protocolDataId={}",
            event.organizationId, event.assistants.size, event.appointmentId, event.protocolDataId
        )

        // Delete previously created KPI events for this protocol data
        kpiEventRepository.deleteByProtocolDataIdAndEventType(
            event.protocolDataId,
            KpiEventType.ASSISTANT_PARTICIPATION
        )

        // Persist updated KPI events for each assistant
        val saved = event.assistants.map { a ->
            kpiEventRepository.save(
                KpiEvent(
                    organizationId = event.organizationId,
                    userId = a.assistantId,
                    userRole = UserRoleType.ASSISTANT,
                    eventType = KpiEventType.ASSISTANT_PARTICIPATION,
                    clientOwnershipType = ClientOwnershipType.CLINIC,
                    appointmentId = event.appointmentId,
                    procedureId = null,
                    protocolDataId = event.protocolDataId,
                    amount = null,
                    assistantType = a.assistantType
                )
            )
        }
        log.debug("Saved {} KPI events for assistant participation", saved.size)
    }

    @Async
    @EventListener
    fun onReceptionClientServed(event: ReceptionClientServedEvent) {
        log.info("Received ReceptionClientServedEvent: organizationId={}, receptionistId={}, appointmentId={}", event.organizationId, event.receptionistId, event.appointmentId)
        val saved = kpiEventRepository.save(
            KpiEvent(
                organizationId = event.organizationId,
                userId = event.receptionistId,
                userRole = UserRoleType.RECEPTIONIST,
                eventType = KpiEventType.RECEPTION_CLIENT_SERVED,
                clientOwnershipType = ClientOwnershipType.CLINIC,
                appointmentId = event.appointmentId,
                procedureId = null,
                protocolDataId = null,
                amount = null,
                assistantType = null
            )
        )
        log.debug("Saved KPI event for reception client served: kpiEventId={}", saved.id)
    }
}
