package kz.saphena.api.repository.organization

import kz.saphena.api.model.organization.OrganizationDocument
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface OrganizationDocumentRepository : JpaRepository<OrganizationDocument, UUID> {

    @Query("""
        select od
        from OrganizationDocument od
        where od.organizationId = :organizationId
        order by od.name
    """)
    fun findAllByOrganizationId(organizationId: UUID): List<OrganizationDocument>

    fun existsByOrganizationIdAndName(id: UUID,
                                      name: String): Boolean

    @Query("""
        select od
        from OrganizationDocument od
        where od.organizationId = :organizationId
            and od.deleted = false 
        order by od.name
    """)
    fun findActiveOrgDocs(organizationId: UUID): List<OrganizationDocument>

}
