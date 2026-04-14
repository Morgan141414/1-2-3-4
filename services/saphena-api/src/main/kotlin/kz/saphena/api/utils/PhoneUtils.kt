package kz.saphena.api.utils


fun String.normalizePhoneDigitsOnly(): String {
    val digits = this.filter { it.isDigit() }
    require(digits.isNotBlank()) { "Phone is empty" }
    return digits
}

fun String.maskedPhone(): String =
    when {
        length <= 4 -> "****"
        else -> take(3) + "****" + takeLast(2)
    }