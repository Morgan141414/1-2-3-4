package kz.saphena.api.utils

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.YearMonth
import java.time.format.DateTimeFormatter

fun LocalDateTime.formatToDayMonthYear(): String {
    val formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy")
    return this.format(formatter)
}

fun LocalDate.formatToDayMonthYear(): String {
    val formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy")
    return this.format(formatter)
}

fun toRange(year: Int, month: Int?): Pair<LocalDateTime, LocalDateTime> {
    return if (month == null || month == 0) {
        val from = LocalDate.of(year, 1, 1).atStartOfDay()
        val to = LocalDate.of(year, 12, 31).atTime(23, 59, 59)
        from to to
    } else {
        val ym = YearMonth.of(year, month)
        val from = ym.atDay(1).atStartOfDay()
        val to = ym.atEndOfMonth().atTime(23, 59, 59)
        from to to
    }
}
