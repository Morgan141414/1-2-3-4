package kz.saphena.api.service

import java.math.BigDecimal
import java.util.UUID
import kz.saphena.api.configuration.RevenueSplitConfig
import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.dto.PageResponse
import kz.saphena.api.dto.kpi.KpiEventDto
import kz.saphena.api.dto.kpi.MyKpiDto
import kz.saphena.api.dto.kpi.toDto
import kz.saphena.api.dto.patient.toPatientResponse
import kz.saphena.api.model.appointment.ClientOwnershipType
import kz.saphena.api.repository.appointment.AppointmentProcedureRepository
import kz.saphena.api.repository.appointment.AppointmentRepository
import kz.saphena.api.repository.doctor.DoctorSettingsRepository
import kz.saphena.api.repository.kpi.KpiEventRepository
import kz.saphena.api.repository.organization.OrganizationUserRepository
import kz.saphena.api.repository.procedure.ProcedureRepository
import kz.saphena.api.utils.toRange
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalTime

@Service
class KpiService(
    private val kpiEventRepository: KpiEventRepository,
    private val appointmentRepository: AppointmentRepository,
    private val appointmentProcedureRepository: AppointmentProcedureRepository,
    private val procedureRepository: ProcedureRepository,
    private val meService: MeService,
    private val doctorSettingsRepository: DoctorSettingsRepository,
    private val organizationUserRepository: OrganizationUserRepository,
    private val revenueSplitConfig: RevenueSplitConfig
) {
    fun getEvents(
        userId: UUID,
        from: LocalDate,
        to: LocalDate,
        pageable: Pageable,
    ): PageResponse<KpiEventDto> {
        val orgId = OrganizationContext.getCurrentOrganizationId()
        val page = kpiEventRepository.findOrganizationEvents(
            organizationId = orgId,
            userId = userId,
            from = from.atStartOfDay(),
            to = to.atTime(LocalTime.MAX),
            pageable = pageable
        )
        return page
            .map {
                val appointment = appointmentRepository.findByIdOrNull(it.appointmentId)
                val appointmentProcedure = it.procedureId?.let { id ->
                    appointmentProcedureRepository.findByIdOrNull(id)
                }
                val procedure = appointmentProcedure?.procedure?.getIdSafely()?.let { id ->
                    procedureRepository.findByIdOrNull(id)
                }
                it.toDto().also { dto ->
                    dto.patient = appointment?.patient?.toPatientResponse()
                    dto.procedureName = procedure?.name
                }
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

    fun myKpi(from: LocalDate,
              to: LocalDate,
              pageable: Pageable): MyKpiDto {
        val orgId = OrganizationContext.getCurrentOrganizationId()
        val myUserId = meService.me().getIdSafely()

        val events = kpiEventRepository.findOrganizationEvents(
            organizationId = orgId,
            userId = myUserId,
            from = from.atStartOfDay(),
            to = to.atTime(LocalTime.MAX),
            pageable = Pageable.unpaged()
        )
        val totalShare = events.fold(BigDecimal.ZERO) { acc, event ->
            val amount = event.amount ?: BigDecimal.ZERO
            val myShare = computeSplit(amount, event.clientOwnershipType.name)
            acc + myShare
        }

        return kpiEventRepository.findOrganizationEvents(
            organizationId = orgId,
            userId = myUserId,
            from = from.atStartOfDay(),
            to = to.atTime(LocalTime.MAX),
            pageable = pageable
        )
            .map {
                val appointment = appointmentRepository.findByIdOrNull(it.appointmentId)
                val appointmentProcedure = it.procedureId?.let { id ->
                    appointmentProcedureRepository.findByIdOrNull(id)
                }
                val procedure = appointmentProcedure?.procedure?.getIdSafely().let { id ->
                    procedureRepository.findByIdOrNull(id)
                }
                it.toDto().also { dto ->
                    dto.patient = appointment?.patient?.toPatientResponse()
                    dto.procedureName = procedure?.name
                    dto.amount = computeSplit(
                        it.amount  ?: BigDecimal.ZERO,
                        it.clientOwnershipType.name
                    )
                }
            }
            .let {
                MyKpiDto(
                    share = totalShare,
                    events = PageResponse(
                        content = it.content,
                        totalPages = it.totalPages,
                        number = it.number,
                        last = it.isLast,
                        ),
                )
            }
    }

    private fun computeSplit(amount: BigDecimal, ownership: String): BigDecimal {
        val userId = meService.me().getIdSafely()
        val orgId = OrganizationContext.getCurrentOrganizationId()

        // Try to get doctor-specific settings
        val orgUser = organizationUserRepository.findByUserIdAndOrganizationId(userId, orgId)
        val settings = orgUser?.let { doctorSettingsRepository.findByDoctorOrganizationId(it.getIdSafely()) }

        return if (ownership == ClientOwnershipType.DOCTOR.name) {
            val ratio = settings?.doctorClientRatio ?: revenueSplitConfig.doctorClientRatio
            amount.multiply(ratio)
        } else {
            val ratio = settings?.clinicClientRatio ?: revenueSplitConfig.clinicClientRatio
            amount.multiply(ratio)
        }
    }
}
