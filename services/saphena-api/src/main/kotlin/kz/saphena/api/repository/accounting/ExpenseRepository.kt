package kz.saphena.api.repository.accounting

import kz.saphena.api.model.accounting.Expense
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@Repository
interface ExpenseRepository : JpaRepository<Expense, UUID> {

    @Query("""
        select coalesce(sum(e.totalCost), 0) from Expense e 
        where e.organizationId = :organizationId 
        and e.type.id = :typeId 
        and e.date >= :from and e.date <= :to
    """)
    fun getTotalExpenseSumByOrganizationIdAndTypeId(
        organizationId: UUID,
        typeId: UUID,
        from: LocalDateTime,
        to: LocalDateTime,
    ): BigDecimal

}