package kz.saphena.api.dto.analytics

import kz.saphena.api.model.first_entry.TrafficSourceType
import java.math.BigDecimal

data class AnalyticResponse(
    val type: String,
    val amount: BigDecimal
)

data class TrafficAnalyticsResponse(
    val type: TrafficSourceType,
    val count: Number
)
