package kz.saphena.api.repository.doctor

import kz.saphena.api.model.doctor.DoctorSpecialization
import kz.saphena.api.model.organization.OrganizationUser
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface DoctorSpecializationRepository : JpaRepository<DoctorSpecialization, UUID> {

    @Query(
        value = """
            select ds
            from DoctorSpecialization ds
            where ds.orgUser.id = :orgUserId
                and ds.specialization.deleted = false
        """
    )
    fun findByOrgUserId(orgUserId: UUID): List<DoctorSpecialization>

    @Query(
        value = """
            select ds
            from DoctorSpecialization ds
            where ds.specialization.id = :specializationId
                and ds.orgUser.organization.id = :organizationId
                and ds.orgUser.deleted = false
        """
    )
    fun findOrgUsersByOrganizationIdAndSpecializationId(
        organizationId: UUID,
        specializationId: UUID,
    ): List<DoctorSpecialization>

}
