package kz.saphena.api.repository.doctor

import kz.saphena.api.model.doctor.DoctorAssistant
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface DoctorAssistantRepository : JpaRepository<DoctorAssistant, UUID> {

    @Query(
        value = """
            select da
            from DoctorAssistant da
            where da.orgUser.id = :orgUserId
            and da.assistant.deleted = false 
        """
    )
    fun findByOrgUserId(orgUserId: UUID): List<DoctorAssistant>

    fun deleteAllByAssistantId(assistantId: UUID)

}
