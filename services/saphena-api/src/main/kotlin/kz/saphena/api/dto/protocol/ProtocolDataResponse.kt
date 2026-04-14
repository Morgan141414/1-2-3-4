package kz.saphena.api.dto.protocol

import kz.saphena.api.model.protocol_data.ProtocolData
import kz.saphena.api.model.protocol_data.ProtocolSectionData
import java.time.LocalDateTime
import java.util.UUID

data class ProtocolDataResponse(
    val id: UUID,
    val appointmentId: UUID?,
    val data: List<ProtocolSectionData>,
    val doctorAssistantId: UUID?,
    val createdAt: LocalDateTime?
)

fun ProtocolData.toProtocolDataResponse() = ProtocolDataResponse(
    id = getIdSafely(),
    appointmentId = appointmentId,
    data = data,
    doctorAssistantId = doctorAssistantId,
    createdAt = createdAt
)
