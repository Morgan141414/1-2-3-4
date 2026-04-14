package kz.saphena.api.model.accounting

import java.time.LocalDate
import java.util.UUID

data class ExpenseFilterParams(
    val bin: String?,
    val from: LocalDate?,
    val to: LocalDate?,
    val typeId: UUID?
)
