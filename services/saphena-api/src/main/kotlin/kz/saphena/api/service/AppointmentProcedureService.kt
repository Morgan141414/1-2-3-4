package kz.saphena.api.service

import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.dto.appointment.AddAppointmentProcedureRequest
import kz.saphena.api.dto.appointment.AppointmentProcedureResponse
import kz.saphena.api.dto.appointment.toAppointmentProcedureResponse
import kz.saphena.api.model.appointment.AppointmentProcedure
import kz.saphena.api.model.appointment.AppointmentProcedureStatusType
import kz.saphena.api.model.appointment.AppointmentStatusType
import kz.saphena.api.repository.appointment.AppointmentProcedureRepository
import kz.saphena.api.repository.appointment.AppointmentRepository
import kz.saphena.api.repository.procedure.ProcedureRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class AppointmentProcedureService(
    private val appointmentProcedureRepository: AppointmentProcedureRepository,
    private val procedureRepository: ProcedureRepository,
    private val appointmentRepository: AppointmentRepository
) {

    fun getAppointmentProcedures(appointmentId: UUID): List<AppointmentProcedureResponse> {
        return appointmentProcedureRepository.findByAppointmentId(appointmentId)
            .map { it.toAppointmentProcedureResponse() }
    }

    fun addProcedureToAppointment(appointmentId: UUID,
                                  request: AddAppointmentProcedureRequest
    ) {
        val appointment =  appointmentRepository.getReferenceById(appointmentId)
        val procedure = procedureRepository.getReferenceById(request.procedureId)

        appointmentProcedureRepository.save(
            AppointmentProcedure(
                appointment = appointment,
                procedure = procedure,
                actualPrice = request.actualPrice,
                status = AppointmentProcedureStatusType.IN_PROGRESS
            )
        )
    }

    @Transactional
    fun closeAppointmentProcedure(id: UUID) {
        val appointmentProcedure = appointmentProcedureRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Appointment Procedure not found")
        appointmentProcedureRepository.save(
            appointmentProcedure.also {
                it.status = AppointmentProcedureStatusType.COMPLETED
            }
        )

        val appointment = appointmentRepository.findByIdOrNull(appointmentProcedure.appointment.id)
            ?: throw EntityNotFoundException("Appointment not found")
        appointmentRepository.save(
            appointment.also {
                it.status = AppointmentStatusType.IN_PROGRESS
            }
        )
    }

}