package kz.saphena.api.model.protocol

import io.hypersistence.utils.hibernate.type.json.JsonType
import jakarta.persistence.Column
import org.hibernate.annotations.Type

data class ProtocolSection(
    val title: String,
    val titleKk: String?,
    val titleEn: String?,
    @Type(JsonType::class)
    @Column(columnDefinition = "jsonb")
    val fields: List<ProtocolField>
)
