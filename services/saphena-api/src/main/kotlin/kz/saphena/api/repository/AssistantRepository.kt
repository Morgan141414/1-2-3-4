package kz.saphena.api.repository

import kz.saphena.api.model.assistant.Assistant
import kz.saphena.api.model.assistant.AssistantType
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface AssistantRepository : JpaRepository<Assistant, UUID> {
    @Query(
        value = """
            select a 
            from Assistant a
            where a.organizationId = :organizationId
            and (:type is null or :type member of a.types)
            order by a.deleted, a.lastName
        """
    )
    fun findByOrganizationId(organizationId: UUID,
                             type: AssistantType?,
                             pageable: Pageable): Page<Assistant>


    @Query(value = "" +
            "SELECT a " +
            "FROM Assistant a " +
            "WHERE a.organizationId = :organizationId " +
            "AND :type MEMBER OF a.types " +
            "AND a.deleted = false")
    fun findAllByOrganizationId(organizationId: UUID,
                                type: AssistantType
    ): List<Assistant>
}
