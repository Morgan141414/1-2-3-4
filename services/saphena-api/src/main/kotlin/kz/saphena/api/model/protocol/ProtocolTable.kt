package kz.saphena.api.model.protocol

data class ProtocolTableColumn(
    val key: String,
    val title: String,
    val titleKk: String?,
    val titleEn: String?,
    val unit: String?,
)

data class ProtocolTableRow(
    val key: String,
    val title: String,
    val titleKk: String?,
    val titleEn: String?,
)