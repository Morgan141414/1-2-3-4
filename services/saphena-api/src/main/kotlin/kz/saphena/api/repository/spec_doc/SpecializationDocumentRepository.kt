package kz.saphena.api.repository.spec_doc

import kz.saphena.api.model.spec_doc.SpecializationDocument
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface SpecializationDocumentRepository : JpaRepository<SpecializationDocument, UUID> {

    @Query("""
        select sd 
        from SpecializationDocument sd 
        where sd.specializationId = :specializationId 
        order by sd.name
    """)
    fun findAllBySpecializationId(specializationId: UUID): List<SpecializationDocument>

    fun existsBySpecializationIdAndName(id: UUID,
                                        name: String): Boolean

    @Query("""
        select sd 
        from SpecializationDocument sd 
        where sd.specializationId = :specializationId 
            and sd.deleted = false
        order by sd.name
    """)
    fun findActiveSpecDocs(specializationId: UUID): List<SpecializationDocument>

}
