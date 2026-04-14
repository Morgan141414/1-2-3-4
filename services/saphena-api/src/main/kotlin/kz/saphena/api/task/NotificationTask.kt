package kz.saphena.api.task

import kz.saphena.api.service.NotificationService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.util.concurrent.TimeUnit

@Component
class NotificationTask(
    private val notificationService: NotificationService,
    @Value("\${notification.send.delay-ms:1000}")
    private val sendDelayMs: Long = 1000,
    @Value("\${notification.retry.max-attempts:3}")
    private val maxRetryAttempts: Int = 3,
    @Value("\${notification.retry.delay-ms:5000}")
    private val retryDelayMs: Long = 5000
) {
    private val logger = LoggerFactory.getLogger(NotificationTask::class.java)

    /**
     * Scheduled task that runs every minute to check for unsent notifications
     * and send them with a delay between each send.
     */
    @Scheduled(fixedDelayString = "\${notification.check.interval-ms:60000}")
    fun checkAndSendNotifications() {
        logger.debug("Starting scheduled notification check")

        val notifications = notificationService.findUnsentNotificationsForToday()
        logger.debug("Found ${notifications.size} unsent notifications scheduled for today")

        if (notifications.isEmpty()) {
            return
        }

        for (notification in notifications) {
            notificationService.sendNotification(notification)

            // Add delay between sending notifications
            if (sendDelayMs > 0) {
                try {
                    TimeUnit.MILLISECONDS.sleep(sendDelayMs)
                } catch (e: InterruptedException) {
                    Thread.currentThread().interrupt()
                    logger.warn("Notification sending was interrupted", e)
                    break
                }
            }
        }

        logger.debug("Completed scheduled notification check")
    }
}
