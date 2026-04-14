package kz.saphena.api.dto.appointment

import kz.saphena.api.dto.procedure.ProcedureResponse
import kz.saphena.api.dto.procedure.toProcedureResponse
import kz.saphena.api.model.appointment.AppointmentProcedure
import kz.saphena.api.model.appointment.AppointmentProcedureStatusType
import java.util.UUID

data class AppointmentProcedureResponse(
    val id: UUID,
    val status: AppointmentProcedureStatusType,
    val procedure: ProcedureResponse,
    val actualPrice: Long?
)

fun AppointmentProcedure.toAppointmentProcedureResponse() = AppointmentProcedureResponse(
    id = getIdSafely(),
    status = status,
    procedure = procedure.toProcedureResponse(),
    actualPrice = actualPrice
)
