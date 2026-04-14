package kz.saphena.notification.service

import kz.saphena.notification.domain.NotificationTemplate
import kz.saphena.notification.repository.NotificationTemplateRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class TemplateService(private val templateRepository: NotificationTemplateRepository) {
    private val logger = LoggerFactory.getLogger(TemplateService::class.java)

    fun createTemplate(template: NotificationTemplate): NotificationTemplate {
        logger.info("Creating template: ${template.templateName}")
        return templateRepository.save(template)
    }

    fun getTemplate(templateName: String): NotificationTemplate {
        return templateRepository.findByTemplateName(templateName)
            ?: throw IllegalArgumentException("Template not found: $templateName")
    }

    fun getAllTemplates(): List<NotificationTemplate> {
        return templateRepository.findAll()
    }

    fun updateTemplate(templateName: String, updatedTemplate: NotificationTemplate): NotificationTemplate {
        val existingTemplate = templateRepository.findByTemplateName(templateName)
            ?: throw IllegalArgumentException("Template not found: $templateName")

        val template = existingTemplate.copy(
            templateContent = updatedTemplate.templateContent,
            whatsappApproved = updatedTemplate.whatsappApproved,
            parameters = updatedTemplate.parameters,
            updatedAt = LocalDateTime.now()
        )

        return templateRepository.save(template)
    }

    fun deleteTemplate(templateName: String) {
        val template = templateRepository.findByTemplateName(templateName)
            ?: throw IllegalArgumentException("Template not found: $templateName")

        templateRepository.delete(template)
    }
}
