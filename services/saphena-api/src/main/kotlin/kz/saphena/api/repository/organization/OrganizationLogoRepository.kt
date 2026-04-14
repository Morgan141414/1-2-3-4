package kz.saphena.api.repository.organization

import kz.saphena.api.model.organization.OrganizationLogo
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface OrganizationLogoRepository : JpaRepository<OrganizationLogo, UUID> {

    fun findByOrganizationId(organizationId: UUID): OrganizationLogo?

}