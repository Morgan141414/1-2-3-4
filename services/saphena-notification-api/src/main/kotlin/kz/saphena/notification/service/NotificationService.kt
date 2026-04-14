package kz.saphena.notification.service

import com.twilio.Twilio
import com.twilio.rest.api.v2010.account.Message
import com.twilio.type.PhoneNumber
import jakarta.annotation.PostConstruct
import kz.saphena.notification.domain.Notification
import kz.saphena.notification.domain.NotificationStatus
import kz.saphena.notification.model.NotificationRequest
import kz.saphena.notification.model.NotificationResponse
import kz.saphena.notification.model.TemplateNotificationRequest
import kz.saphena.notification.repository.NotificationRepository
import kz.saphena.notification.repository.NotificationTemplateRepository
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Service
class NotificationService(
    private val notificationRepository: NotificationRepository,
    private val templateRepository: NotificationTemplateRepository
) {
    private val logger = LoggerFactory.getLogger(NotificationService::class.java)
    private val dateFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME

    @Value("\${twilio.account-sid}")
    private lateinit var twilioAccountSid: String

    @Value("\${twilio.auth-token}")
    private lateinit var twilioAuthToken: String

    @Value("\${twilio.whatsapp-from-number}")
    private lateinit var whatsappFromNumber: String

    @PostConstruct
    fun initTwilio() {
        Twilio.init(twilioAccountSid, twilioAuthToken)
        logger.info("Twilio client initialized")
    }

    fun createNotification(request: NotificationRequest): NotificationResponse {
        val notification = Notification(
            message = request.message,
            recipient = request.recipient,
            type = request.type,
            metadata = request.metadata
        )

        val savedNotification = notificationRepository.save(notification)
        logger.info("Notification created with ID: ${savedNotification.id}")

        // Attempt to send the notification
        return try {
            val twilioResponse = sendWhatsappMessage(savedNotification)
            updateNotificationAsSent(savedNotification.id!!, twilioResponse)
        } catch (e: Exception) {
            logger.error("Failed to send WhatsApp message", e)
            updateNotificationAsFailed(savedNotification.id!!, e.message ?: "Unknown error")
        }
    }

    fun createTemplateNotification(request: TemplateNotificationRequest): NotificationResponse {
        val template = templateRepository.findByTemplateName(request.templateName)
            ?: throw IllegalArgumentException("Template not found: ${request.templateName}")

        // Replace placeholders in the template with actual values
        var messageContent = template.templateContent
//        request.parameters.forEach { (key, value) ->
//            messageContent = messageContent.replace("{{$key}}", value)
//        }

        val notification = Notification(
            message = messageContent,
            recipient = request.recipient,
            type = request.type,
            metadata = request.metadata
        )

        val savedNotification = notificationRepository.save(notification)
        logger.info("Template notification created with ID: ${savedNotification.id}")

        // Attempt to send the notification
        return try {
            val twilioResponse = sendWhatsappMessage(savedNotification)
            updateNotificationAsSent(savedNotification.id!!, twilioResponse)
        } catch (e: Exception) {
            logger.error("Failed to send WhatsApp message", e)
            updateNotificationAsFailed(savedNotification.id!!, e.message ?: "Unknown error")
        }
    }

    private fun sendWhatsappMessage(notification: Notification): String {
        val to = PhoneNumber("whatsapp:${notification.recipient}")
        val from = PhoneNumber("whatsapp:$whatsappFromNumber")

        val message = Message.creator(
            to,
            from,
            notification.message
        ).create()

        logger.info("WhatsApp message sent: ${message.sid}")
        return message.sid
    }

    private fun updateNotificationAsSent(id: String, twilioMessageId: String): NotificationResponse {
        val notification = notificationRepository.findById(id).orElseThrow()
        val updatedNotification = notification.copy(
            status = NotificationStatus.SENT,
            sentAt = LocalDateTime.now(),
            whatsappMessageId = twilioMessageId
        )

        val saved = notificationRepository.save(updatedNotification)

        return NotificationResponse(
            id = saved.id!!,
            recipient = saved.recipient,
            status = saved.status.name,
            message = saved.message,
            sentAt = saved.sentAt,
            createdAt = saved.createdAt,
        )
    }

    private fun updateNotificationAsFailed(id: String, errorMessage: String): NotificationResponse {
        val notification = notificationRepository.findById(id).orElseThrow()
        val updatedNotification = notification.copy(
            status = NotificationStatus.FAILED,
            errorMessage = errorMessage,
            retryCount = notification.retryCount + 1
        )

        val saved = notificationRepository.save(updatedNotification)

        return NotificationResponse(
            id = saved.id!!,
            recipient = saved.recipient,
            status = saved.status.name,
            message = saved.message,
            sentAt = saved.sentAt,
            createdAt = saved.createdAt
        )
    }

    fun getNotification(id: String): NotificationResponse {
        val notification = notificationRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Notification not found: $id") }

        return NotificationResponse(
            id = notification.id!!,
            recipient = notification.recipient,
            status = notification.status.name,
            message = notification.message,
            sentAt = notification.sentAt,
            createdAt = notification.createdAt
        )
    }

    fun getAllNotifications(pageable: Pageable): Page<NotificationResponse> {
        return notificationRepository.findAll(pageable).map { notification ->
            NotificationResponse(
                id = notification.id!!,
                recipient = notification.recipient,
                status = notification.status.name,
                message = notification.message,
                sentAt = notification.sentAt,
                createdAt = notification.createdAt
            )
        }
    }

    fun updateStatus(id: String, status: NotificationStatus): NotificationResponse {
        val notification = notificationRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Notification not found: $id") }

        val updatedNotification = when (status) {
            NotificationStatus.DELIVERED -> notification.copy(
                status = status,
                deliveredAt = LocalDateTime.now()
            )
            NotificationStatus.READ -> notification.copy(
                status = status,
                readAt = LocalDateTime.now()
            )
            else -> notification.copy(status = status)
        }

        val saved = notificationRepository.save(updatedNotification)

        return NotificationResponse(
            id = saved.id!!,
            recipient = saved.recipient,
            status = saved.status.name,
            message = saved.message,
            sentAt = saved.sentAt,
            createdAt = saved.createdAt
        )
    }
}
