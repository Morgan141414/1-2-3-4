package kz.saphena.api.dto.kpi

import kz.saphena.api.dto.PageResponse
import java.math.BigDecimal

data class MyKpiDto(
    val share: BigDecimal,
    val events: PageResponse<KpiEventDto>,
)
