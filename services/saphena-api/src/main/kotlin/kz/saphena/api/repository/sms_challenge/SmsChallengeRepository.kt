package kz.saphena.api.repository.sms_challenge

import jakarta.persistence.LockModeType
import kz.saphena.api.model.sms_challenge.SmsChallenge
import kz.saphena.api.model.sms_challenge.SmsPurpose
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Lock
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface SmsChallengeRepository : JpaRepository<SmsChallenge, UUID> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        select c 
        from SmsChallenge c
        where c.phone = :phone
            and c.purpose = :purpose
        order by c.createdAt desc
    """)
    fun findLatestForUpdate(
        phone: String,
        purpose: SmsPurpose
    ): List<SmsChallenge>

}