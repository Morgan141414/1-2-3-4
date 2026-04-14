package kz.saphena.api.repository.organization

import kz.saphena.api.model.organization.Organization
import org.javers.spring.annotation.JaversSpringDataAuditable
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
@JaversSpringDataAuditable
interface OrganizationRepository : JpaRepository<Organization, UUID> {
    @Query(value = "" +
            "SELECT o " +
            "FROM Organization o " +
            "WHERE o.deleted = false")
    fun findOrganizations(pageable: Pageable): Page<Organization>

    fun existsByClinicName(clinicName: String): Boolean

    fun existsByBin(bin: String): Boolean

}
