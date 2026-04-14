package kz.saphena.api.service

import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.dto.calendar.CalendarEventResponse
import kz.saphena.api.dto.calendar.toCalendarEventResponse
import kz.saphena.api.repository.appointment.AppointmentRepository
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.util.UUID

@Service
class CalendarService(
    private val appointmentRepository: AppointmentRepository,
    private val appointmentProcedureService: AppointmentProcedureService,
    private val meService: MeService
) {
    fun getCalendarEvents(
        doctorId: UUID,
        start: LocalDate,
        end: LocalDate
    ): List<CalendarEventResponse> {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        val startDate = start.atStartOfDay()
        val endDate = end
            .plusDays(1)
            .atStartOfDay()
            .minusNanos(1)

        return appointmentRepository.findDoctorAppointmentsByOrganizationIdBetweenDates(
            myOrgId,
            doctorId,
            startDate,
            endDate
        ).map {
            val procedures = appointmentProcedureService.getAppointmentProcedures(it.getIdSafely())

            it.toCalendarEventResponse(procedures)
        }
    }

    fun getDoctorEvents(start: LocalDate,
                        end: LocalDate): List<CalendarEventResponse> {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()
        val userId = meService.me().getIdSafely()

        val startDate = start.atStartOfDay()
        val endDate = end
            .plusDays(1)
            .atStartOfDay()
            .minusNanos(1)

        return appointmentRepository.findDoctorAppointmentsByOrganizationIdBetweenDates(
            myOrgId,
            userId,
            startDate,
            endDate
        ).map {
            val procedures = appointmentProcedureService.getAppointmentProcedures(it.getIdSafely())

            it.toCalendarEventResponse(procedures)
        }
    }
}
