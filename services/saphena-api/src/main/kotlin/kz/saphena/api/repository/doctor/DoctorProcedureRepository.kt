package kz.saphena.api.repository.doctor

import kz.saphena.api.model.doctor.DoctorProcedure
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface DoctorProcedureRepository : JpaRepository<DoctorProcedure, UUID> {

    @Query(value = """
        select dp
        from DoctorProcedure dp
        where dp.doctorSpecialization.orgUser.user.id = :doctorId
            and dp.doctorSpecialization.orgUser.organization.id = :organizationId
            and dp.doctorSpecialization.specialization.id = :specializationId
            and dp.organizationProcedure.deleted = false
        order by dp.organizationProcedure.procedure.name
    """)
    fun findByDoctorIdAndOrganizationIdAndSpecializationId(doctorId: UUID,
                                                           organizationId: UUID,
                                                           specializationId: UUID): List<DoctorProcedure>

    @Query(value = """
        select dp
        from DoctorProcedure dp
        where dp.doctorSpecialization.id = :docSpecId
            and dp.organizationProcedure.deleted = false
        order by dp.organizationProcedure.procedure.name
    """)
    fun findByDoctorSpecializationId(docSpecId: UUID): List<DoctorProcedure>

    fun deleteAllByDoctorSpecializationId(docSpecId: UUID)
}
