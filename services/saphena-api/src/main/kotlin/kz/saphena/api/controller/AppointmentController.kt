package kz.saphena.api.controller

import kz.saphena.api.dto.appointment.CreateAppointmentRequest
import kz.saphena.api.dto.appointment.UpdatePaymentStatusRequest
import kz.saphena.api.model.appointment.AppointmentFilterParams
import kz.saphena.api.service.AppointmentService
import kz.saphena.api.service.EventPublishingService
import kz.saphena.api.service.NotificationService
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.web.PageableDefault
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime
import java.util.UUID

@RestController
@RequestMapping("/api/appointments")
class AppointmentController(
    private val appointmentService: AppointmentService,
    private val notificationService: NotificationService,
    private val publishingService: EventPublishingService
) {
    private val logger = LoggerFactory.getLogger(AppointmentController::class.java)

    private fun currentUsername(): String =
        SecurityContextHolder.getContext().authentication?.name ?: "anonymous"

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_DOCTOR', 'ROLE_RECEPTIONIST')")
    fun getAppointments(
        @PageableDefault(sort = ["datetime"], direction = Sort.Direction.DESC)
        pageable: Pageable,
        filter: AppointmentFilterParams
    ) = run {
        logger.info("User '{}' fetching appointments with filter={} page={} size={}", currentUsername(), filter, pageable.pageNumber, pageable.pageSize)
        appointmentService.getMyAppointments(pageable, filter)
    }

    @GetMapping("patient")
    @PreAuthorize("hasRole('ROLE_PATIENT')")
    fun getPatientAppointments(
        @PageableDefault(sort = ["datetime"], direction = Sort.Direction.DESC)
        pageable: Pageable,
        filter: AppointmentFilterParams
    ) = run {
        logger.info("Patient '{}' fetching appointments with filter={} page={} size={}", currentUsername(), filter, pageable.pageNumber, pageable.pageSize)
        appointmentService.getPatientAppointments(pageable, filter)
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_OPERATOR', 'ROLE_RECEPTIONIST')")
    fun createAppointment(
        @RequestBody request: CreateAppointmentRequest
    ) {
        logger.info("User '{}' creating appointment: doctorId={} patientId={} datetime={} endDatetime={} procedures={} roomId={} ownership={}",
            currentUsername(), request.doctorId, request.patientId, request.datetime, request.endDatetime, request.procedures.size, request.roomId, request.clientOwnershipType)
        val appointment = appointmentService.createAppointment(request)
        publishingService.publishAppointmentCreated(appointment, currentUsername())
        notificationService.onCreated(appointment)
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_DOCTOR', 'ROLE_OPERATOR', 'ROLE_RECEPTIONIST', 'ROLE_PATIENT')")
    fun getAppointment(
        @PathVariable id: UUID
    ) = run {
        logger.info("User '{}' fetching appointment id={}", currentUsername(), id)
        appointmentService.getAppointment(id)
    }

    @PostMapping("{id}/reschedule")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_OPERATOR', 'ROLE_RECEPTIONIST')")
    fun rescheduleAppointment(
        @PathVariable id: UUID,
        @RequestParam datetime: LocalDateTime,
        @RequestParam(name = "end-datetime")
        endDatetime: LocalDateTime
    ) {
        logger.info("User '{}' rescheduling appointment id={} to datetime={} endDatetime={}", currentUsername(), id, datetime, endDatetime)
        val rescheduledAppointment = appointmentService.rescheduleAppointment(id, datetime, endDatetime)
        notificationService.onRescheduled(rescheduledAppointment)
    }

    @PostMapping("{id}/cancel")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_OPERATOR', 'ROLE_RECEPTIONIST')")
    fun cancelAppointment(
        @PathVariable id: UUID
    ) {
        logger.info("User '{}' cancelling appointment id={}", currentUsername(), id)
        val canceledAppointment= appointmentService.cancelAppointment(id)
        notificationService.onCanceled(canceledAppointment)
    }

    @PostMapping("{id}/close")
    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    fun closeAppointment(
        @PathVariable id: UUID,
        @RequestBody comment: String?
    ) = run {
        logger.info("User '{}' closing appointment id={} with commentPresent={}", currentUsername(), id, comment != null)
        val closedAppointment = appointmentService.closeAppointment(id, comment)
        publishingService.publishAppointmentClosed(closedAppointment, currentUsername())
    }

    @PostMapping("{id}/attach-patient")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_OPERATOR', 'ROLE_RECEPTIONIST')")
    fun attachPatient(
        @PathVariable
        id: UUID,
        @RequestParam(required = true)
        patientId: UUID,
    ) = run {
        logger.info("User '{}' attaching patientId={} to appointment id={}", currentUsername(), patientId, id)
        appointmentService.attachPatient(
            appointmentId = id,
            patientId = patientId,
        )
    }

    @PatchMapping("{id}/payment-status")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_OPERATOR', 'ROLE_RECEPTIONIST')")
    fun updatePaymentStatus(
        @PathVariable
        id: UUID,
        @RequestBody
        request: UpdatePaymentStatusRequest
    ) = run {
        logger.info(
            "User '{}' updating paymentStatus={} and paymentType={} to appointment id={}",
            currentUsername(),
            request.paymentStatus,
            request.paymentType,
            id
        )
        appointmentService.updatePaymentStatus(
            id = id,
            request = request,
        )
    }

    @GetMapping("first-entry-check")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_OPERATOR', 'ROLE_RECEPTIONIST')")
    fun checkForFirstEntry(
        @RequestParam patientId: UUID
    ) = run {
        logger.info("User '{}' checking first entry for patientId={}", currentUsername(), patientId)
        appointmentService.checkForFirstEntry(patientId)
    }

}
