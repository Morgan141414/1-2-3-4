package kz.saphena.notification.repository

import kz.saphena.notification.domain.NotificationTemplate
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface NotificationTemplateRepository : MongoRepository<NotificationTemplate, String> {
    fun findByTemplateName(templateName: String): NotificationTemplate?
}
