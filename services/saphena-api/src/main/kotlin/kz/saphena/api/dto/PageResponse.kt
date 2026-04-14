package kz.saphena.api.dto

data class PageResponse<T> (
    val content: List<T>,
    val totalPages: Int,
    val number: Int,
    val last: Boolean
)