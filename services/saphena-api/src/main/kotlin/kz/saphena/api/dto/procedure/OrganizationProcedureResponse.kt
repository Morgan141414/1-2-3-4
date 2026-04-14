package kz.saphena.api.dto.procedure

import kz.saphena.api.model.procedure.OrganizationProcedure
import java.util.*

data class OrganizationProcedureResponse(
    val id: UUID,
    val procedure: ProcedureResponse,
    val roomRequired: Boolean,
    val roomIds: List<UUID>,
    val deleted: Boolean,
    val modified: Boolean?,
)

fun OrganizationProcedure.toOrganizationProcedureResponse(
    roomIds: List<UUID>,
    modified: Boolean?
) = OrganizationProcedureResponse(
    id = getIdSafely(),
    procedure = procedure.toProcedureResponse(),
    roomRequired = roomRequired,
    roomIds = roomIds,
    deleted = deleted,
    modified = modified
)
