package kz.saphena.api.service

import jakarta.persistence.EntityExistsException
import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.dto.PageResponse
import kz.saphena.api.dto.appointment.AddAppointmentProcedureRequest
import kz.saphena.api.dto.appointment.AppointmentResponse
import kz.saphena.api.dto.appointment.CreateAppointmentRequest
import kz.saphena.api.dto.appointment.UpdatePaymentStatusRequest
import kz.saphena.api.dto.appointment.toAppointmentResponse
import kz.saphena.api.model.appointment.Appointment
import kz.saphena.api.model.appointment.AppointmentFilterParams
import kz.saphena.api.model.appointment.AppointmentSpecifications
import kz.saphena.api.model.appointment.AppointmentStatusType
import kz.saphena.api.model.first_entry.FirstEntry
import kz.saphena.api.model.user.UserRoleType
import kz.saphena.api.repository.FirstEntryRepository
import kz.saphena.api.repository.PatientRepository
import kz.saphena.api.repository.appointment.AppointmentProcedureRepository
import kz.saphena.api.repository.appointment.AppointmentRepository
import kz.saphena.api.repository.doctor.DoctorRepository
import kz.saphena.api.repository.room.RoomRepository
import org.slf4j.LoggerFactory

import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.domain.Specification
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDateTime
import java.util.UUID

@Service
class AppointmentService(
    private val appointmentRepository: AppointmentRepository,
    private val patientRepository: PatientRepository,
    private val appointmentProcedureService: AppointmentProcedureService,
    private val doctorRepository: DoctorRepository,
    private val firstEntryRepository: FirstEntryRepository,
    private val meService: MeService,
    private val roomRepository: RoomRepository,
    private val appointmentProcedureRepository: AppointmentProcedureRepository,
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun getMyAppointments(
        pageable: Pageable,
        filter: AppointmentFilterParams
    ): PageResponse<AppointmentResponse> {
        val me = meService.me()
        val myOrgId = OrganizationContext.getCurrentOrganizationId()
        log.info(
            "Fetching my appointments: role={}, orgId={}, search='{}', status={}, from={}, to={}, page={}, size={}",
            me.role,
            myOrgId,
            filter.search,
            filter.status,
            filter.from,
            filter.to,
            pageable.pageNumber,
            pageable.pageSize
        )

        val doctorId = when (me.role) {
            UserRoleType.DOCTOR -> me.getIdSafely()
            else -> null
        }

        val spec = Specification
            .where(AppointmentSpecifications.hasOrganization(myOrgId))
                .and(AppointmentSpecifications.hasDoctor(doctorId))
                .and(AppointmentSpecifications.hasStatus(filter.status))
                .and(AppointmentSpecifications.dateFrom(filter.from))
                .and(AppointmentSpecifications.dateTo(filter.to))
                .and(AppointmentSpecifications.search(filter.search))

        return getAppointmentsBySpecification(spec, pageable)
    }

    fun getPatientAppointments(
        pageable: Pageable,
        filter: AppointmentFilterParams
    ): PageResponse<AppointmentResponse> {
        val me = meService.me()
        val patient = patientRepository.findByUserId(me.getIdSafely())
            ?: throw EntityNotFoundException("User not found")

        log.info(
            "Fetching patient appointments: patientId={}, status={}, from={}, to={}, page={}, size={}",
            patient.getIdSafely(),
            filter.status,
            filter.from,
            filter.to,
            pageable.pageNumber,
            pageable.pageSize
        )

        val spec = Specification.where(AppointmentSpecifications.hasPatient(patient.getIdSafely()))
            .and(AppointmentSpecifications.hasStatus(filter.status))
            .and(AppointmentSpecifications.dateFrom(filter.from))
            .and(AppointmentSpecifications.dateTo(filter.to))

        return getAppointmentsBySpecification(spec, pageable)
    }

    @Transactional
    fun createAppointment(request: CreateAppointmentRequest): Appointment {
        log.info(
            """
                Creating appointment: 
                doctorId={}, 
                orgUserId={}, 
                patientId={}, 
                datetime={}, 
                endDatetime={}, 
                specializationId={}, 
                roomId={}, 
                clientOwnership={}, 
                tempPatientName={}, 
                tempPatientPhone={},
            """.trimIndent(),
            request.doctorId,
            request.orgUserId,
            request.patientId,
            request.datetime,
            request.endDatetime,
            request.specializationId,
            request.roomId,
            request.clientOwnershipType,
            request.tempPatientName,
            request.tempPatientPhone,
        )

        if (request.endDatetime <= request.datetime) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "End must be after start")
        }

        println("before check overlapping")

        if (appointmentRepository.existsOverlappingAppointments(
                request.doctorId,
                request.datetime,
                request.endDatetime,
                null
            )
        ) {
            throw EntityExistsException("Appointment time conflict")
        }

        println("after check overlapping")

        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        val patient = request.patientId
            ?.let { patientRepository.getReferenceById(it) }

        val doctor = doctorRepository.findByIdOrNull(request.doctorId)
            ?: throw EntityNotFoundException("Doctor Not Found")

        val appointment = appointmentRepository.save(
            Appointment(
                organizationId = myOrgId,
                doctor = doctor,
                orgUserId = request.orgUserId,
                specializationId = request.specializationId,
                patient = patient,
                datetime = request.datetime,
                endDatetime = request.endDatetime,
                status = AppointmentStatusType.SCHEDULED,
                comment = null,
                roomId = request.roomId,
                clientOwnership = request.clientOwnershipType,
                tempPatientName = request.tempPatientName,
                tempPatientPhone = request.tempPatientPhone,
            )
        )
        log.info("Appointment created: id={}", appointment.id)

        request.procedures.forEach { ap ->
            appointmentProcedureService.addProcedureToAppointment(
                appointment.getIdSafely(),
                AddAppointmentProcedureRequest(
                    procedureId = ap.procedureId,
                    actualPrice = ap.actualPrice
                )
            )
        }

        log.debug("Added {} procedures to appointment {}", request.procedures.size, appointment.id)

        if (request.trafficSource != null && request.patientId != null) {
            firstEntryRepository.save(
                FirstEntry(
                    patientId = request.patientId,
                    organizationId = myOrgId,
                    trafficSource = request.trafficSource
                )
            )
        }

        return appointment
    }

    fun getAppointment(id: UUID): AppointmentResponse {
        appointmentRepository.findByIdOrNull(id)
            ?.let {
                val procedures = appointmentProcedureRepository.findByAppointmentId(it.getIdSafely())
                val room = it.roomId?.let { id -> roomRepository.findByIdOrNull(id)?.name }

                return it.toAppointmentResponse(procedures, room)
            } ?: throw EntityNotFoundException("Appointment Not Found")
    }

    fun rescheduleAppointment(id: UUID,
                              datetime: LocalDateTime,
                              endDatetime: LocalDateTime): Appointment {
        if (endDatetime <= datetime) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "End must be after start")
        }

        val appointment = appointmentRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Appointment not found")

        if (appointmentRepository.existsOverlappingAppointments(
                appointment.doctor.getIdSafely(),
                datetime,
                endDatetime,
                id
            )
        ) {
            throw EntityExistsException("Appointment time conflict")
        }

        val updatedAppointment = appointmentRepository.save(
            appointment.also {
                it.datetime = datetime
                it.endDatetime = endDatetime
            }
        )

        return updatedAppointment
    }

    fun cancelAppointment(id: UUID): Appointment {
        val appointment = appointmentRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Appointment not found")

        if (appointment.status !== AppointmentStatusType.SCHEDULED) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST)
        }

        val canceledAppointment = appointmentRepository.save(
            appointment.also {
                it.status = AppointmentStatusType.CANCELLED
            }
        )

        return canceledAppointment
    }

    fun closeAppointment(id: UUID,
                         comment: String?): Appointment {
        val appointment = appointmentRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Appointment not found")

        appointmentRepository.save(
            appointment.also {
                it.status = AppointmentStatusType.COMPLETED
                it.comment = comment?.trim().takeUnless { c -> c.isNullOrBlank() }
            }
        )

        return appointment
    }

    @Transactional
    fun attachPatient(
        appointmentId: UUID,
        patientId: UUID,
    ) {
        val appointment = appointmentRepository.findByIdOrNull(appointmentId)
            ?: throw EntityNotFoundException("Appointment not found")
        val patient = patientRepository.getReferenceById(patientId)

        appointmentRepository.save(
            appointment.also {
                it.patient = patient
                it.tempPatientName = null
                it.tempPatientPhone = null
            }
        )
    }

    fun updatePaymentStatus(
        id: UUID,
        request: UpdatePaymentStatusRequest,
    ) {
        val appointment = appointmentRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Appointment not found")

        appointmentRepository.save(
            appointment.also {
                it.paymentType = request.paymentType
                it.paymentStatus = request.paymentStatus
            }
        )
    }

    fun checkForFirstEntry(patientId: UUID): Boolean {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        return !firstEntryRepository.existsByPatientIdAndOrganizationId(patientId, myOrgId)
    }

    private fun getAppointmentsBySpecification(
        spec: Specification<Appointment>,
        pageable: Pageable
    ): PageResponse<AppointmentResponse> {
        val page = appointmentRepository.findAll(spec, pageable)

        log.debug(
            "Appointments page fetched: totalElements={}, totalPages={}, number={}, size={}",
            page.totalElements,
            page.totalPages,
            page.number,
            page.size
        )

        val appointmentIds = page.content.map { it.getIdSafely() }

        val procedures = appointmentProcedureRepository
            .findAllByAppointmentIdIn(appointmentIds)
            .groupBy { it.appointment.getIdSafely() }

        val responses = page.content.map {
            it.toAppointmentResponse(
                procedures = procedures[it.id] ?: emptyList(),
                room = it.roomId?.let { roomId -> roomRepository.findByIdOrNull(roomId)?.name }
            )
        }

        return PageResponse(
            content = responses,
            totalPages = page.totalPages,
            number = page.number,
            last = page.isLast
        )
    }

}
