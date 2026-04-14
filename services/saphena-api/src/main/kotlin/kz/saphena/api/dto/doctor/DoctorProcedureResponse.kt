package kz.saphena.api.dto.doctor

import kz.saphena.api.dto.procedure.OrganizationProcedureResponse
import kz.saphena.api.dto.procedure.toOrganizationProcedureResponse
import kz.saphena.api.model.doctor.DoctorProcedure
import java.util.UUID

data class DoctorProcedureResponse (
    val id: UUID,
    val orgProcedure: OrganizationProcedureResponse,
    val price: Number?,
)

fun DoctorProcedure.toDoctorProcedureResponse(roomIds: List<UUID>) = DoctorProcedureResponse(
    id = getIdSafely(),
    orgProcedure = organizationProcedure.toOrganizationProcedureResponse(
        roomIds = roomIds,
        modified = null,
    ),
    price = price
)