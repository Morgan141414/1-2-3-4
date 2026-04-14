package kz.saphena.api.controller

import kz.saphena.api.service.CalendarService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate
import java.util.UUID

@RestController
@RequestMapping("/api/calendar")
class CalendarController(
    private val calendarService: CalendarService
) {

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_OPERATOR', 'ROLE_RECEPTIONIST')")
    fun getCalendarEvents(
        @RequestParam(required = true)
        doctorId: UUID,
        @RequestParam(required = true)
        start: LocalDate,
        @RequestParam(required = true)
        end: LocalDate
    ) = calendarService.getCalendarEvents(doctorId, start, end)

    @GetMapping("doctor")
    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    fun getDoctorEvents(
        @RequestParam(required = true)
        start: LocalDate,
        @RequestParam(required = true)
        end: LocalDate
    ) = calendarService.getDoctorEvents(start, end)

}
