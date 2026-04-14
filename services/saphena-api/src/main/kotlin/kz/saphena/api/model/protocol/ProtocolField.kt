package kz.saphena.api.model.protocol

import kz.saphena.api.model.assistant.AssistantType
import kz.saphena.api.model.patient.GenderType
import java.util.*

data class ProtocolField(
    val key: String,
    val title: String,
    val titleKk: String?,
    val titleEn: String?,
    val required: Boolean?,
    val gender: GenderType?,
    val type: ProtocolFieldType,
    val unit: String,
    val options: List<String>,
    val assistantType: AssistantType?,
    val doctorSpecializationId: UUID?,
    val tableColumns: List<ProtocolTableColumn>?,
    val tableRows: List<ProtocolTableRow>?,
)
