package kz.saphena.api.repository.accounting

import kz.saphena.api.model.accounting.ExpenseType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface ExpenseTypeRepository : JpaRepository<ExpenseType, UUID> {

    fun existsByOrganizationIdAndName(organizationId: UUID,
                                      name: String): Boolean

    @Query(value = "" +
            "SELECT et from ExpenseType et " +
            "WHERE et.organizationId = :organizationId " +
            "AND et.deleted = false " +
            "ORDER BY et.name")
    fun findAllByOrganizationId(organizationId: UUID): List<ExpenseType>
}