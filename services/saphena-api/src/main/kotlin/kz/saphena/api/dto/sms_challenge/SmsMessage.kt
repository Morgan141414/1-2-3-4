package kz.saphena.api.dto.sms_challenge

data class SmsMessage(
    val phone: String, // digits only, no '+'
    val text: String,
)
