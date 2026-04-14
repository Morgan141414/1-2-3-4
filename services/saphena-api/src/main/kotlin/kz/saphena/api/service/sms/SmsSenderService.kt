package kz.saphena.api.service.sms

import kz.saphena.api.dto.sms_challenge.SmsMessage

interface SmsSenderService {
    fun send(message: SmsMessage)
}