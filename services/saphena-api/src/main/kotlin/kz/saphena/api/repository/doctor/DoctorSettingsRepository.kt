package kz.saphena.api.repository.doctor

import kz.saphena.api.model.doctor.DoctorSettings
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.UUID

interface DoctorSettingsRepository : JpaRepository<DoctorSettings, UUID> {
    @Query(
        """
        SELECT ds FROM DoctorSettings ds
        WHERE ds.doctorId.id = :doctorOrganizationId
        AND ds.deleted = false
    """
    )
    fun findByDoctorOrganizationId(doctorOrganizationId: UUID): DoctorSettings?
}
