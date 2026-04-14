package kz.saphena.notification.controller

import jakarta.validation.Valid
import kz.saphena.notification.domain.NotificationStatus
import kz.saphena.notification.model.NotificationRequest
import kz.saphena.notification.model.NotificationResponse
import kz.saphena.notification.model.TemplateNotificationRequest
import kz.saphena.notification.service.NotificationService
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/notifications")
class NotificationController(
    private val notificationService: NotificationService
) {

    @PostMapping
    fun createNotification(@Valid @RequestBody request: NotificationRequest): ResponseEntity<NotificationResponse> {
        val response = notificationService.createNotification(request)
        return ResponseEntity(response, HttpStatus.CREATED)
    }

    @PostMapping("/template")
    fun createTemplateNotification(@Valid @RequestBody request: TemplateNotificationRequest): ResponseEntity<NotificationResponse> {
        val response = notificationService.createTemplateNotification(request)
        return ResponseEntity(response, HttpStatus.CREATED)
    }

    @GetMapping("/{id}")
    fun getNotification(@PathVariable id: String): ResponseEntity<NotificationResponse> {
        val notification = notificationService.getNotification(id)
        return ResponseEntity(notification, HttpStatus.OK)
    }

    @GetMapping
    fun getAllNotifications(@PageableDefault(size = 20) pageable: Pageable): ResponseEntity<Page<NotificationResponse>> {
        val notifications = notificationService.getAllNotifications(pageable)
        return ResponseEntity(notifications, HttpStatus.OK)
    }

    @PatchMapping("/{id}/status")
    fun updateStatus(
        @PathVariable id: String,
        @RequestParam status: NotificationStatus
    ): ResponseEntity<NotificationResponse> {
        val updated = notificationService.updateStatus(id, status)
        return ResponseEntity(updated, HttpStatus.OK)
    }

}
