package kz.saphena.api.configuration.security

import java.util.UUID

object OrganizationContext {
    private val currentOrganizationId = ThreadLocal<UUID>()

    fun setCurrentOrganizationId(id: UUID) {
        currentOrganizationId.set(id)
    }

    fun getCurrentOrganizationId(): UUID = currentOrganizationId.get()
        ?: throw IllegalStateException("Organization ID not set")

    fun clearCurrentOrganizationId() {
        currentOrganizationId.remove()
    }
}