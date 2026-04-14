package kz.saphena.api.dto.sms_challenge

import com.fasterxml.jackson.databind.JsonNode

data class MobizonResponse(
    val code: Int,
    val message: String?,
    val data: JsonNode? = null,
)
