package kz.saphena.api.model.protocol_data

import io.hypersistence.utils.hibernate.type.json.JsonType
import jakarta.persistence.Column
import org.hibernate.annotations.Type

data class ProtocolSectionData(
    val title: String,
    val titleKk: String?,
    val titleEn: String?,
    @Type(JsonType::class)
    @Column(columnDefinition = "jsonb")
    val fields: List<ProtocolFieldData>
) {

    fun getLocalizedTitle(lang: String): String =
        when (lang.lowercase()) {
            "kk" -> titleKk ?: title
            "en" -> titleEn ?: title
            else -> title
        }
}
