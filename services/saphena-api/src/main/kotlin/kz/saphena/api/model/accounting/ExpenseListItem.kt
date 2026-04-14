package kz.saphena.api.model.accounting

import java.math.BigDecimal

data class ExpenseListItem(
    val name: String,
    val count: Int,
    val cost: BigDecimal,
    val sum: BigDecimal
)
