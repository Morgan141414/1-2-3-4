package kz.saphena.api.dto.procedure

import kz.saphena.api.model.procedure.Procedure
import kz.saphena.api.model.procedure.ProcedureType
import java.util.UUID

data class ProcedureResponse(
    val id: UUID,
    val name: String,
    val type: ProcedureType,
    val key: String?,
    val nameKk: String?,
    val nameEn: String?,
    val deleted: Boolean,
)

fun Procedure.toProcedureResponse() = ProcedureResponse(
    id = getIdSafely(),
    name = name,
    type = type,
    key = key,
    nameKk = nameKk,
    nameEn = nameEn,
    deleted = deleted,
)
