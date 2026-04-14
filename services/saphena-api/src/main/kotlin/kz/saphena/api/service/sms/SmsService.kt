package kz.saphena.api.service.sms

import kz.saphena.api.dto.sms_challenge.SmsMessage
import org.springframework.stereotype.Service

@Service
class SmsService(
    private val senderService: SmsSenderService,
) {

    fun sendRaw(phone: String, text: String) {
        senderService.send(
            SmsMessage(
                phone = phone,
                text = text,
            )
        )
    }

}