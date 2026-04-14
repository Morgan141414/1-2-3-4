package kz.saphena.api.service

import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.dto.analytics.AnalyticResponse
import kz.saphena.api.dto.analytics.TrafficAnalyticsResponse
import kz.saphena.api.model.first_entry.TrafficSourceType
import kz.saphena.api.model.user.UserRoleType
import kz.saphena.api.repository.FirstEntryRepository
import kz.saphena.api.repository.accounting.ExpenseRepository
import kz.saphena.api.repository.accounting.ExpenseTypeRepository
import kz.saphena.api.repository.appointment.AppointmentProcedureRepository
import kz.saphena.api.repository.appointment.AppointmentRepository
import kz.saphena.api.repository.doctor.DoctorRepository
import kz.saphena.api.repository.organization.OrganizationUserRepository
import kz.saphena.api.utils.getShortFullName
import kz.saphena.api.utils.toRange
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class AnalyticsService(
    private val firstEntryRepository: FirstEntryRepository,
    private val expenseRepository: ExpenseRepository,
    private val expenseTypeRepository: ExpenseTypeRepository,
    private val organizationUserRepository: OrganizationUserRepository,
    private val doctorRepository: DoctorRepository,
    private val appointmentRepository: AppointmentRepository,
    private val appointmentProcedureRepository: AppointmentProcedureRepository,
) {

    fun getTrafficAnalytics(year: Int, month: Int?): List<TrafficAnalyticsResponse> {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        val analytics = mutableListOf<TrafficAnalyticsResponse>()
        val (from, to) = toRange(year, month)

        TrafficSourceType.entries.forEach { type ->
            val count = firstEntryRepository.countByOrganizationIdAndTrafficSource(
                myOrgId,
                type,
                from,
                to
            )
            analytics.add(
                TrafficAnalyticsResponse(
                    type = type,
                    count = count,
                )
            )
        }

        return analytics
    }

    fun getExpenseAnalytics(year: Int, month: Int?): List<AnalyticResponse> {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        val analytics = mutableListOf<AnalyticResponse>()
        val (from, to) = toRange(year, month)

        val expenseTypes = expenseTypeRepository.findAllByOrganizationId(myOrgId)

        expenseTypes.forEach { type ->
            val expenseAmount = expenseRepository.getTotalExpenseSumByOrganizationIdAndTypeId(
                myOrgId,
                type.getIdSafely(),
                from,
                to
            )

            analytics.add(
                AnalyticResponse(
                    type = type.name,
                    amount = expenseAmount,
                )
            )
        }

        return analytics
    }

    fun getIncomeAnalytics(year: Int, month: Int?): List<AnalyticResponse> {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        val analytics = mutableListOf<AnalyticResponse>()
        val (from, to) = toRange(year, month)

        val orgUsers = organizationUserRepository.findOrganizationUsersByOrganizationIdAndRole(myOrgId, UserRoleType.DOCTOR)

        orgUsers.forEach { ou ->
            val doctor = doctorRepository.findByIdOrNull(ou.user.getIdSafely())

            val appointmentIds = appointmentRepository.findAllCompletedAppointmentIdsByOrganizationIdAndDoctorIdBetweenDates(
                myOrgId,
                ou.user.getIdSafely(),
                from,
                to
            )

            val incomeAmount = appointmentProcedureRepository.getTotalIncomeSumByAppointmentIds(appointmentIds)

            analytics.add(
                AnalyticResponse(
                    type = doctor?.let {
                        getShortFullName(
                            doctor.firstName,
                            doctor.lastName,
                            doctor.middleName
                        )
                   } ?: "unknown" ,
                    amount = incomeAmount,
                )
            )
        }

        return analytics
    }

}