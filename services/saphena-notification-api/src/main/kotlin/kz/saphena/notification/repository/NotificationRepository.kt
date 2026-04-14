package kz.saphena.notification.repository

import kz.saphena.notification.domain.Notification
import kz.saphena.notification.domain.NotificationStatus
import kz.saphena.notification.domain.NotificationType
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface NotificationRepository : MongoRepository<Notification, String> {
    fun findByRecipient(recipient: String, pageable: Pageable): Page<Notification>

    fun findByStatus(status: NotificationStatus, pageable: Pageable): Page<Notification>

    fun findByStatusAndCreatedAtBefore(status: NotificationStatus, createdAt: LocalDateTime): List<Notification>

    fun countByStatusAndRecipient(status: NotificationStatus, recipient: String): Long

    fun findByType(type: NotificationType, pageable: Pageable): Page<Notification>

    fun findByStatusAndRetryCountLessThan(status: NotificationStatus, retryCount: Int): List<Notification>
}
