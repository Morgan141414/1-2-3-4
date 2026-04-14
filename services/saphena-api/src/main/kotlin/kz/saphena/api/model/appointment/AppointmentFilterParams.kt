package kz.saphena.api.model.appointment

import java.time.LocalDate

data class AppointmentFilterParams(
    val search: String?,
    val from: LocalDate?,
    val to: LocalDate?,
    val status: AppointmentStatusType?
)
