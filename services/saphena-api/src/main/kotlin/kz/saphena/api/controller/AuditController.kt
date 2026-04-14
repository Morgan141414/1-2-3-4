package kz.saphena.api.controller

import kz.saphena.api.model.appointment.Appointment
import kz.saphena.api.model.organization.Organization
import org.javers.core.Changes
import org.javers.core.Javers
import org.javers.repository.jql.QueryBuilder
import org.slf4j.LoggerFactory
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/audit")
class AuditController(
    private val javers: Javers
) {
    private val logger = LoggerFactory.getLogger(AuditController::class.java)

    @GetMapping("/organizations/{id}/changes")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun getOrganizationChanges(
        @PathVariable id: UUID,
    ): Changes {
        logger.info("Fetching organization changes id={}", id)
        val queryBuilder = QueryBuilder.byInstanceId(id, Organization::class.java)
        return javers.findChanges(queryBuilder.build())
    }
    
    @GetMapping("/appointments/{id}/changes")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun getAppointmentChanges(
        @PathVariable id: UUID,
    ): Changes {
        logger.info("Fetching appointment changes id={}", id)
        val queryBuilder = QueryBuilder.byInstanceId(id, Appointment::class.java)
        return javers.findChanges(queryBuilder.build())
    }
}
