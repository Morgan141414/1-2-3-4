package kz.saphena.api.service

import kz.saphena.api.client.NotificationClient
import kz.saphena.api.model.appointment.Appointment
import kz.saphena.api.model.notification.NotificationEntity
import kz.saphena.api.model.notification.NotifyStatus
import kz.saphena.api.model.notification.NotifyType
import kz.saphena.api.repository.appointment.AppointmentProcedureRepository
import kz.saphena.api.repository.notification.NotificationRepository
import kz.saphena.api.repository.organization.OrganizationRepository
import kz.saphena.api.utils.getFullName
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.UUID

@Service
class NotificationService(
    private val notificationRepository: NotificationRepository,
    private val notificationClient: NotificationClient,
    @Value("\${notification.service.enabled:true}")
    private val isEnabled: Boolean = true,
    private val appointmentProcedureRepository: AppointmentProcedureRepository,
    procedureRepository: AppointmentProcedureRepository,
    private val organizationRepository: OrganizationRepository
) {
    private val logger = LoggerFactory.getLogger(NotificationService::class.java)

    fun onCreated(appointment: Appointment) {
        createAndSaveNotification(appointment, NotifyType.ON_CREATE)
    }

    fun onRescheduled(appointment: Appointment) {
        deleteExistingNotifications(appointment.getIdSafely())
        createAndSaveNotification(appointment, NotifyType.ON_RESCHEDULE)
    }

    fun onCanceled(appointment: Appointment) {
        deleteExistingNotifications(appointment.getIdSafely())
        createAndSaveNotification(appointment, NotifyType.ON_CANCEL)
    }

    private fun deleteExistingNotifications(appointmentId: UUID) {
        val existingNotifications = notificationRepository.findByAppointmentId(appointmentId)
        notificationRepository.deleteAll(existingNotifications)
    }

    private fun createAndSaveNotification(appointment: Appointment, notifyType: NotifyType) {
        val notification = createNotification(appointment, notifyType)
        notificationRepository.save(notification)
    }

    private fun createNotification(appointment: Appointment, notifyType: NotifyType): NotificationEntity {
        val phone = appointment.patient?.phone
            ?: appointment.tempPatientPhone
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Patient does not have a phone number")
        val formattedDateTime = appointment.datetime.format(DateTimeFormatter.ofPattern("dd.MM.yyyy 'в' HH:mm"))
        val procedureName = appointmentProcedureRepository.findByAppointmentId(appointment.getIdSafely())
            .getOrNull(0)
            ?.procedure
            ?.name
        val doctor = appointment.doctor
        val doctorName = getFullName(doctor.firstName, doctor.lastName, doctor.lastName)
        val organization = organizationRepository.findByIdOrNull(appointment.organizationId)

        val message = when (notifyType) {
            NotifyType.ON_CREATE -> "Здравствуйте, ${appointment.patient?.firstName ?: appointment.tempPatientName}! " +
                    "Вы записаны на ${procedureName ?: "приём"} $formattedDateTime. " +
                    "к врачу $doctorName, " +
                    "по адресу ${organization?.address}, ${organization?.clinicName}. " +
                    "Если у вас возникли вопросы или вам нужно изменить время — пожалуйста, свяжитесь с нами. Спасибо!"
            NotifyType.ON_RESCHEDULE -> "Здравствуйте, ${appointment.patient?.firstName ?: appointment.tempPatientName}! " +
                    "Ваш приём был перенесен на $formattedDateTime. " +
                    "Если у вас возникли вопросы или вам нужно изменить время — пожалуйста, свяжитесь с нами. Спасибо!"
            NotifyType.ON_CANCEL -> "Здравствуйте, ${appointment.patient?.firstName ?: appointment.tempPatientName}! " +
                    "Ваш приём на $formattedDateTime был отменен. " +
                    "Если у вас возникли вопросы — пожалуйста, свяжитесь с нами. Спасибо!"
            else -> throw IllegalArgumentException("Unsupported notification type: $notifyType")
        }

        return NotificationEntity(
            appointment = appointment,
            phone = phone,
            message = message,
            scheduledAt = LocalDateTime.now(),
            notifyType = notifyType,
            status = NotifyStatus.SCHEDULED
        )
    }

    /**
     * Finds all unsent notifications scheduled for today
     */
    fun findUnsentNotificationsForToday(): List<NotificationEntity> {
        return notificationRepository.findByStatusAndScheduledAtDate(NotifyStatus.SCHEDULED, LocalDate.now())
    }

    /**
     * Sends a notification and updates its status
     * @return true if the notification was sent successfully, false otherwise
     */
    fun sendNotification(notification: NotificationEntity): Boolean {
        if (!isEnabled) {
            logger.info("Notification service is disabled. Would have sent to ${notification.phone}: ${notification.message}")
            notification.status = NotifyStatus.SENT
            notificationRepository.save(notification)
            return true
        }

        return try {
            logger.info("Sending notification to ${notification.phone}: ${notification.message}")

            // Use the organization ID as the client ID
            val clientId = notification.appointment.organizationId.toString()

            val success = notificationClient.sendMessage(
                clientId = clientId,
                phoneNumber = notification.phone,
                message = notification.message
            )

            notification.status = if (success) NotifyStatus.SENT else NotifyStatus.FAILED
            notificationRepository.save(notification)
            success
        } catch (e: Exception) {
            logger.error("Failed to send notification to ${notification.phone}: ${e.message}", e)
            notification.status = NotifyStatus.FAILED
            notificationRepository.save(notification)
            false
        }
    }
}
