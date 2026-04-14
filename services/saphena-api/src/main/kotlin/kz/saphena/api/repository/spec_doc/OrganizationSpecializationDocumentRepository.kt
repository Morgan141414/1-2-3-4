package kz.saphena.api.repository.spec_doc

import  kz.saphena.api.model.spec_doc.OrganizationSpecializationDocument
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface OrganizationSpecializationDocumentRepository : JpaRepository<OrganizationSpecializationDocument, UUID> {

    @Query("""
        select osd
        from OrganizationSpecializationDocument osd
        join SpecializationDocument sd on sd.id = osd.specializationDocument.id
        where osd.organizationId = :organizationId
            and sd.specializationId = :specializationId
        order by sd.name
    """)
    fun findAllByOrganizationIdAndSpecializationId(
        organizationId: UUID,
        specializationId: UUID
    ): List<OrganizationSpecializationDocument>

    @Query("""
        select osd
        from OrganizationSpecializationDocument osd
        where osd.organizationId = :organizationId
            and osd.specializationDocument.specializationId = :specializationId
            and osd.deleted = false
        order by osd.specializationDocument.name
    """)
    fun findActiveOrganizationSpecializationDocuments(
        organizationId: UUID,
        specializationId: UUID,
    ): List<OrganizationSpecializationDocument>

}