package kz.saphena.api.service

import java.math.BigDecimal
import kz.saphena.api.configuration.RevenueSplitConfig
import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.dto.kpi.AssistantKpiSummary
import kz.saphena.api.dto.kpi.AssistantParticipation
import kz.saphena.api.dto.kpi.DoctorKpiSummary
import kz.saphena.api.dto.kpi.OperatorKpiSummary
import kz.saphena.api.dto.kpi.ReceptionKpiSummary
import kz.saphena.api.model.appointment.ClientOwnershipType
import kz.saphena.api.model.kpi.KpiEventType
import kz.saphena.api.repository.AssistantRepository
import kz.saphena.api.repository.UserRepository
import kz.saphena.api.repository.doctor.DoctorRepository
import kz.saphena.api.repository.doctor.DoctorSettingsRepository
import kz.saphena.api.repository.kpi.KpiEventRepository
import kz.saphena.api.repository.organization.OrganizationUserRepository
import kz.saphena.api.utils.getFullName
import kz.saphena.api.utils.toRange
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalTime

@Service
class KpiAggregationService(
    private val kpiEventRepository: KpiEventRepository,
    private val doctorRepository: DoctorRepository,
    private val assistantRepository: AssistantRepository,
    private val userRepository: UserRepository,
    private val doctorSettingsRepository: DoctorSettingsRepository,
    private val organizationUserRepository: OrganizationUserRepository,
    private val revenueSplitConfig: RevenueSplitConfig
) {
    fun doctorKpi(from: LocalDate,
                  to: LocalDate): List<DoctorKpiSummary> {
        val orgId = OrganizationContext.getCurrentOrganizationId()
        val events = kpiEventRepository.findOrganizationEventsByTypeAndRange(
            type = KpiEventType.DOCTOR_SERVICE_PROVIDED,
            organizationId = orgId,
            from = from.atStartOfDay(),
            to = to.atTime(LocalTime.MAX),
        )

        val byDoctor = events.groupBy { it.userId }
        return byDoctor.map { (doctorId, list) ->
            val totals = list.fold(Triple(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO)) { acc, e ->
                val amount = e.amount ?: BigDecimal.ZERO
                val ownership = e.clientOwnershipType.name
                val (total, doctor, clinic) = acc
                val (doctorShare, clinicShare) = computeSplit(doctorId, orgId, amount, ownership)
                Triple(total + amount, doctor + doctorShare, clinic + clinicShare)
            }
            val doctor = doctorRepository.findByIdOrNull(doctorId)

            DoctorKpiSummary(
                doctorId = doctorId,
                totalRevenue = totals.first,
                doctorShare = totals.second,
                clinicShare = totals.third,
                doctorFullname = getFullName(
                    doctor?.firstName ?: "",
                    doctor?.lastName ?: "",
                    doctor?.middleName)
            )
        }
    }

    fun assistantKpi(from: LocalDate,
                     to: LocalDate): List<AssistantKpiSummary> {
        val orgId = OrganizationContext.getCurrentOrganizationId()
        val events = kpiEventRepository.findOrganizationEventsByTypeAndRange(
            type = KpiEventType.ASSISTANT_PARTICIPATION,
            organizationId = orgId,
            from = from.atStartOfDay(),
            to = to.atTime(LocalTime.MAX),
        )

        val byAssistant = events.groupBy { it.userId }
        return byAssistant.map { (assistantId, list) ->
            val participations: List<AssistantParticipation> = list
                .groupBy { it.assistantType }
                .map { (type, grouped) ->
                    AssistantParticipation(
                        assistantType = type,
                        count = grouped.size.toLong()
                    )
                }
            val assistant = assistantRepository.findByIdOrNull(assistantId)

            AssistantKpiSummary(
                assistantId = assistantId,
                participations = participations,
                assistantFullname = getFullName(
                    assistant?.firstName ?: "",
                    assistant?.lastName ?: "",
                    assistant?.middleName)
            )
        }
    }

    fun operatorKpi(from: LocalDate,
                    to: LocalDate): List<OperatorKpiSummary> {
        val orgId = OrganizationContext.getCurrentOrganizationId()
        val events = kpiEventRepository.findOrganizationEventsByTypeAndRange(
            type = KpiEventType.OPERATOR_APPOINTMENT_CREATED,
            organizationId = orgId,
            from = from.atStartOfDay(),
            to = to.atTime(LocalTime.MAX),
        )
        return events.groupBy { it.userId }.map { (operatorId, list) ->
            val operator = userRepository.findByIdOrNull(operatorId)

            OperatorKpiSummary(
                operatorId = operatorId,
                appointmentsCreated = list.size.toLong(),
                operatorUsername = operator?.username ?: "unknown"
            )
        }
    }

    fun receptionKpi(from: LocalDate,
                     to: LocalDate): List<ReceptionKpiSummary> {
        val orgId = OrganizationContext.getCurrentOrganizationId()
        val events = kpiEventRepository.findOrganizationEventsByTypeAndRange(
            type = KpiEventType.RECEPTION_CLIENT_SERVED,
            organizationId = orgId,
            from = from.atStartOfDay(),
            to = to.atTime(LocalTime.MAX),
        )
        return events.groupBy { it.userId }.map { (receptionistId, list) ->
            val operator = userRepository.findByIdOrNull(receptionistId)

            ReceptionKpiSummary(
                receptionistId = receptionistId,
                clientsServed = list.size.toLong(),
                receptionUsername = operator?.username ?: "unknown"
            )
        }
    }

    private fun computeSplit(
        doctorId: java.util.UUID,
        orgId: java.util.UUID,
        amount: BigDecimal,
        ownership: String
    ): Pair<BigDecimal, BigDecimal> {
        // Try to get doctor-specific settings
        val orgUser = organizationUserRepository.findByUserIdAndOrganizationId(doctorId, orgId)
        val settings = orgUser?.let { doctorSettingsRepository.findByDoctorOrganizationId(it.getIdSafely()) }

        val doctorShare = if (ownership == ClientOwnershipType.DOCTOR.name) {
            val ratio = settings?.doctorClientRatio ?: revenueSplitConfig.doctorClientRatio
            amount.multiply(ratio)
        } else {
            val ratio = settings?.clinicClientRatio ?: revenueSplitConfig.clinicClientRatio
            amount.multiply(ratio)
        }

        val clinicShare = amount.subtract(doctorShare)
        return doctorShare to clinicShare
    }
}
