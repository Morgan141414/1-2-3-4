package kz.saphena.api.model.protocol_data

import kz.saphena.api.dto.Mkb10Response
import kz.saphena.api.model.assistant.AssistantType
import kz.saphena.api.model.protocol.ProtocolFieldType
import kz.saphena.api.model.protocol.ProtocolTableColumn
import kz.saphena.api.model.protocol.ProtocolTableRow
import kz.saphena.api.model.protocol.ProvidedProcedure
import java.util.*

data class ProtocolFieldData(
    val key: String,
    val type: ProtocolFieldType,
    val title: String,
    val titleKk: String?,
    val titleEn: String?,
    val value: String?,
    val from: Number?,
    val to: Number?,
    val diagnosis: List<Mkb10Response>?,
    val assistantType: AssistantType?,
    val assistantIds: List<UUID>?,
    val doctorSpecializationId: UUID?,
    val doctorIds: List<UUID>?,
    val providedProcedures: List<ProvidedProcedure>?,
    val unit: String?,
    val tableColumns: List<ProtocolTableColumn>?,
    val tableRows: List<ProtocolTableRow>?,
    val tableData: Map<String, String>?,
) {

    fun getLocalizedTitle(lang: String): String =
        when (lang.lowercase()) {
            "kk" -> titleKk ?: title
            "en" -> titleEn ?: title
            else -> title
        }
}
