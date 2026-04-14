package kz.saphena.api.dto.protocol

import jakarta.validation.constraints.NotNull
import kz.saphena.api.model.protocol.ProtocolSection

data class CreateProtocolRequest(
    @get:NotNull
    val sections: List<ProtocolSection>,
    val consultationRequired: Boolean?,
    val templateFileName: String?
)