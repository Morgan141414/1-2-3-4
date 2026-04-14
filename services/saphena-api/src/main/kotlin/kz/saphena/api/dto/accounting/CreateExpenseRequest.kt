package kz.saphena.api.dto.accounting

import kz.saphena.api.model.accounting.ExpenseListItem
import java.math.BigDecimal
import java.time.LocalDate
import java.util.UUID

data class CreateExpenseRequest(
    val typeId: UUID,
    val vendorId: UUID?,
    val vendorBin: String?,
    val vendorName: String?,
    val contactPersonName: String?,
    val contactPersonPhone: String?,
    val date: LocalDate,
    val expenseList: List<ExpenseListItem>,
    val totalCost: BigDecimal,
    val comment: String?
)
