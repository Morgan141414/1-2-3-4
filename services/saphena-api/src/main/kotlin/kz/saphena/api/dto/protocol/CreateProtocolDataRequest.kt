package kz.saphena.api.dto.protocol

import jakarta.validation.constraints.NotNull
import kz.saphena.api.model.protocol_data.ProtocolSectionData
import java.util.UUID

data class CreateProtocolDataRequest(
    @get:NotNull
    val protocolId: UUID,
    @get:NotNull
    val patientId: UUID,
    @get:NotNull
    val data: List<ProtocolSectionData>,
    val appointmentId: UUID?,
    val doctorAssistantId: UUID?,
)