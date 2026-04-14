package kz.saphena.api.repository.procedure

import kz.saphena.api.model.procedure.Procedure
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface ProcedureRepository : JpaRepository<Procedure, UUID> {

    @Query(value = """
        select p
        from Procedure p
        where p.specializationId = :specializationId
        order by p.name
    """)
    fun findAllBySpecializationId(specializationId: UUID): List<Procedure>

    fun existsBySpecializationIdAndName(id: UUID,
                                        name: String): Boolean

    fun existsBySpecializationIdAndKey(id: UUID,
                                       key: String?): Boolean

    @Query(value = """
        select p
        from Procedure p
        where p.specializationId = :specializationId
            and p.deleted = false
        order by p.name
    """)
    fun findActiveProcedures(specializationId: UUID): List<Procedure>

}
