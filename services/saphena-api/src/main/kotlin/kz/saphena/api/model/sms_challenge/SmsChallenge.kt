package kz.saphena.api.model.sms_challenge

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import kz.saphena.api.model.AbstractBaseAuditableEntity
import java.time.LocalDateTime

@Entity
class SmsChallenge(
    @Column
    val phone: String,
    @Enumerated(EnumType.STRING)
    @Column
    val purpose: SmsPurpose,
    @Column
    var codeHash: String,
    @Column
    var expiresAt: LocalDateTime,
    @Column
    var attempts: Int = 0,
    @Enumerated(EnumType.STRING)
    @Column
    var status: SmsChallengeStatus = SmsChallengeStatus.PENDING,
    @Column(name = "verified_at")
    var verifiedAt: LocalDateTime? = null,
) : AbstractBaseAuditableEntity()
