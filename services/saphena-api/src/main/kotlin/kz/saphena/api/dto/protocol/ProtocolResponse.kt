package kz.saphena.api.dto.protocol

import kz.saphena.api.model.protocol.ProtocolSection
import java.util.UUID

data class ProtocolResponse(
    val id: UUID,
    val sections: List<ProtocolSection>,
    val consultationRequired: Boolean?,
    val templateFileName: String?,
    val modified: Boolean,
)
