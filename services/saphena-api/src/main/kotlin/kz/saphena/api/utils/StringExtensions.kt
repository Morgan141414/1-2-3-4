package kz.saphena.api.utils

fun String?.nullIfBlankTrimmed(): String? =
    this?.trim()?.takeIf { it.isNotEmpty() }