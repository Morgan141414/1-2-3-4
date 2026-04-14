package kz.saphena.api.repository.procedure

import kz.saphena.api.model.procedure.OrganizationProcedure
import kz.saphena.api.model.specialization.Specialization
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface OrganizationProcedureRepository : JpaRepository<OrganizationProcedure, UUID> {

    @Query("""
        select op
        from OrganizationProcedure op
        join Procedure p on p.id = op.procedure.id
        where op.organizationId = :organizationId
            and p.specializationId = :specializationId
        order by p.name
    """)
    fun findAllByOrganizationIdAndSpecializationId(
        organizationId: UUID,
        specializationId: UUID
    ): List<OrganizationProcedure>

    @Query("""
        select op
        from OrganizationProcedure op
        where op.organizationId = :organizationId
            and op.procedure.specializationId = :specializationId
            and op.deleted = false
        order by op.procedure.name
    """)
    fun findActiveOrganizationProcedures(
        organizationId: UUID,
        specializationId: UUID,
    ): List<OrganizationProcedure>

    @Query("""
        select s
        from OrganizationProcedure op
        join Procedure p on p.id = op.procedure.id
        join Specialization s on s.id = p.specializationId
        where op.organizationId = :organizationId
        order by s.name
    """)
    fun findActiveSpecializations(
        organizationId: UUID,
    ): List<Specialization>

}
