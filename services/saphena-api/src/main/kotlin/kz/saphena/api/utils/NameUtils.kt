package kz.saphena.api.utils

fun getFullName(firstName: String, lastName: String, middleName: String? = null): String {
    return listOfNotNull(lastName, firstName, middleName)
        .joinToString(" ")
        .trim()
}

fun getShortFullName(firstName: String, lastName: String, middleName: String? = null): String {
    val initials = buildList {
        if (firstName.isNotBlank()) add(firstName.first().uppercaseChar() + ".")
        if (!middleName.isNullOrBlank()) add(middleName.first().uppercaseChar() + ".")
    }.joinToString("")

    return listOfNotNull(lastName.ifBlank { null }, initials.ifBlank { null })
        .joinToString(" ")
        .trim()
}