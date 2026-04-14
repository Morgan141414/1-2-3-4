package kz.saphena.api.dto.accounting

import kz.saphena.api.model.accounting.ExpenseType
import java.util.UUID

data class ExpenseTypeResponse(
    val id: UUID,
    val name: String
)

fun ExpenseType.toResponse() = ExpenseTypeResponse(
    id = getIdSafely(),
    name = name
)