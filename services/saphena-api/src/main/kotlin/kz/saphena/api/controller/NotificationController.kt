package kz.saphena.api.controller

import kz.saphena.api.client.NotificationClient
import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.exception.NotificationClientException
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Controller for notification-related endpoints
 */
@RestController
@RequestMapping("/api/notifications")
class NotificationController(
    private val notificationClient: NotificationClient
) {
    /**
     * Creates a new notification client
     * Only accessible to users with ROLE_ORGANIZATION_ADMIN
     *
     * @return ResponseEntity with success status
     */
    @PostMapping("/clients")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun createClient(): ResponseEntity<Map<String, Any>> {
        val clientId = OrganizationContext.getCurrentOrganizationId().toString()
        val success = notificationClient.createClient(clientId)

        return if (success) {
            ResponseEntity.ok(mapOf("success" to true, "message" to "Client created successfully"))
        } else {
            ResponseEntity.badRequest().body(mapOf("success" to false, "message" to "Failed to create client"))
        }
    }

    /**
     * Retrieves the QR code for binding a WhatsApp number for a specific client
     * Only accessible to users with ROLE_ORGANIZATION_ADMIN
     *
     * @return String representation of the QR code
     */
    @GetMapping("/clients/qr")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun getQrCode(): String {
        val clientId = OrganizationContext.getCurrentOrganizationId().toString()
        return notificationClient.getQrCode(clientId)
    }

    /**
     * Deletes a notification client
     * Only accessible to users with ROLE_ORGANIZATION_ADMIN
     *
     * @param clientId The client identifier
     * @return ResponseEntity with success status
     */
    @DeleteMapping("/clients")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun deleteClient(): ResponseEntity<Map<String, Any>> {
        val clientId = OrganizationContext.getCurrentOrganizationId().toString()
        val success = notificationClient.deleteClient(clientId)

        return if (success) {
            ResponseEntity.ok(mapOf("success" to true, "message" to "Client deleted successfully"))
        } else {
            ResponseEntity.badRequest().body(mapOf("success" to false, "message" to "Failed to delete client"))
        }
    }

    /**
     * Gets the status of a client
     * Only accessible to users with ROLE_ORGANIZATION_ADMIN
     *
     * @return The client status for successful responses
     * @throws NotificationClientException if there's an error communicating with the notification service
     */
    @GetMapping("/clients/status")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun getClientStatus(): ResponseEntity<Map<String, Any>> {
        val clientId = OrganizationContext.getCurrentOrganizationId().toString()
        val status = notificationClient.getClientStatus(clientId)
        return ResponseEntity.ok(status)
    }
}
