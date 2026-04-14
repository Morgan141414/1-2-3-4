package kz.saphena.api.dto.protocol

import jakarta.validation.constraints.NotNull
import kz.saphena.api.model.protocol_data.ProtocolSectionData
import java.util.UUID

data class UpdateProtocolDataRequest(
    @get:NotNull
    val data: List<ProtocolSectionData>,
    val doctorAssistantId: UUID?
)