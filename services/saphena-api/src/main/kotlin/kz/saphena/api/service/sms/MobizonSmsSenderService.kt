package kz.saphena.api.service.sms

import kz.saphena.api.dto.sms_challenge.MobizonResponse
import kz.saphena.api.dto.sms_challenge.SmsMessage
import kz.saphena.api.utils.maskedPhone
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Primary
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.client.RestClient

@Service
@Primary
class MobizonSmsSenderService(
    private val restClient: RestClient,
    @Value("\${sms.mobizon.host}") private val host: String,
    @Value("\${sms.mobizon.api-key}") private val apiKey: String,
) : SmsSenderService {
    private val log = LoggerFactory.getLogger(MobizonSmsSenderService::class.java)

    override fun send(message: SmsMessage) {
        try {
            val form = LinkedMultiValueMap<String, String>()
                .apply {
                    add("recipient", message.phone)
                    add("text", message.text)
                    add("params[validity]", "1440") // minutes
                }

            val resp = restClient.post()
                .uri { b ->
                    b
                        .scheme("https")
                        .host(host)
                        .path("service/message/sendSmsMessage")
                        .queryParam("output", "json")
                        .queryParam("api", "v1")
                        .queryParam("apiKey", apiKey)
                        .build()
                }
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(MobizonResponse::class.java)

            if (resp?.code != 0) {
                log.warn(
                    "SMS send FAILED provider=Mobizon phone={} code={} msg={} data={}",
                    message.phone.maskedPhone(),
                    resp?.code,
                    resp?.message,
                    resp?.data
                )
                throw IllegalStateException("SMS sending failed: ${resp?.code} ${resp?.message}")
            }

            log.info("SMS sent provider=Mobizon phone={}", message.phone.maskedPhone())
        } catch (e: Exception) {
            log.error("SMS send ERROR provider=Mobizon phone={}", message.phone.maskedPhone(), e)
            throw e
        }
    }

}