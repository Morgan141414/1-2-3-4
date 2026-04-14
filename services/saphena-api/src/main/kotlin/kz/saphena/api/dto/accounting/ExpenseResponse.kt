package kz.saphena.api.dto.accounting

import kz.saphena.api.model.accounting.Expense
import kz.saphena.api.model.accounting.ExpenseListItem
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

data class ExpenseResponse(
    val id: UUID,
    val type: String,
    val vendorBin: String?,
    val vendorName: String?,
    val contactPersonName: String?,
    val contactPersonPhone: String?,
    val date: LocalDateTime,
    val expenseList: List<ExpenseListItem>,
    val totalCost: BigDecimal,
    val comment: String?
)

fun Expense.toResponse() = ExpenseResponse(
    id = getIdSafely(),
    type = type.name,
    vendorBin = vendor?.bin,
    vendorName = vendor?.name,
    contactPersonName = contactPersonName,
    contactPersonPhone = contactPersonPhone,
    date = date,
    expenseList = expenseList,
    totalCost = totalCost,
    comment = comment
)
