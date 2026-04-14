package kz.saphena.api.service.sms

import kz.saphena.api.exception.SmsCooldownException
import kz.saphena.api.model.sms_challenge.SmsChallenge
import kz.saphena.api.model.sms_challenge.SmsChallengeStatus
import kz.saphena.api.model.sms_challenge.SmsPurpose
import kz.saphena.api.repository.sms_challenge.SmsChallengeRepository
import kz.saphena.api.utils.normalizePhoneDigitsOnly
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Duration
import java.time.LocalDateTime

@Service
class SmsChallengeService(
    private val smsChallengeRepository: SmsChallengeRepository,
    private val smsService: SmsService,
) {
    private val encoder = BCryptPasswordEncoder()

    @Transactional
    fun createAndSend(
        phoneRaw: String,
        purpose: SmsPurpose,
        ttlMinutes: Long = 5,
        cooldownSeconds: Long = 60
    ) {
        val phone = phoneRaw.normalizePhoneDigitsOnly()
        val now = LocalDateTime.now()

        val last = smsChallengeRepository.findLatestForUpdate(phone, purpose).firstOrNull()

        // cooldown: не чаще 1 раза в минуту для phone+purpose
        val createdAt = last?.createdAt
        if (createdAt != null) {
            val nextAllowed = createdAt.plusSeconds(cooldownSeconds)
            if (now.isBefore(nextAllowed)) {
                val secondsLeft = Duration.between(now, nextAllowed).seconds.coerceAtLeast(1)
                throw SmsCooldownException(secondsLeft)
            }
        }

        val code = (100000..999999).random().toString()
        val hash = encoder.encode(code)

        smsChallengeRepository.save(
            SmsChallenge(
                phone = phone,
                purpose = purpose,
                codeHash = hash,
                expiresAt = now.plusMinutes(ttlMinutes),
                status = SmsChallengeStatus.PENDING
            )
        )

        val text = when (purpose) {
            SmsPurpose.PHONE_VERIFICATION -> "Код подтверждения номера: $code"
            SmsPurpose.PASSWORD_RESET -> "Код для сброса пароля: $code"
            SmsPurpose.REGISTRATION -> "Код для регистрации: $code"
        }

        smsService.sendRaw(phone, text)
    }

    @Transactional
    fun verify(
        phoneRaw: String,
        purpose: SmsPurpose,
        code: String,
        maxAttempts: Int = 3
    ): Boolean {
        val phone = phoneRaw.normalizePhoneDigitsOnly()
        val now = LocalDateTime.now()

        val challenge = smsChallengeRepository.findLatestForUpdate(phone, purpose).firstOrNull() ?: return false

        if (challenge.status != SmsChallengeStatus.PENDING) return false

        if (challenge.expiresAt.isBefore(now)) {
            challenge.status = SmsChallengeStatus.EXPIRED
            smsChallengeRepository.save(challenge)
            return false
        }

        challenge.attempts++
        if (challenge.attempts > maxAttempts) {
            challenge.status = SmsChallengeStatus.FAILED
            smsChallengeRepository.save(challenge)
            return false
        }

        val ok = encoder.matches(code, challenge.codeHash)
        if (!ok) {
            smsChallengeRepository.save(challenge)
            return false
        }

        challenge.status = SmsChallengeStatus.VERIFIED
        challenge.verifiedAt = now
        challenge.codeHash = "USED"
        smsChallengeRepository.save(challenge)
        return true
    }

}