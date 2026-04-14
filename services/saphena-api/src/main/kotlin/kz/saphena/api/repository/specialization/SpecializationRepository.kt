package kz.saphena.api.repository.specialization

import kz.saphena.api.model.specialization.Specialization
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface SpecializationRepository : JpaRepository<Specialization, UUID> {

    @Query("""
        select s
        from Specialization s
        order by s.name
    """)
    override fun findAll(): List<Specialization>

    @Query("""
        select s
        from Specialization s
        where s.deleted = false
        order by s.name
    """)
    fun findActiveSpecializations(): List<Specialization>

    fun existsByName(name: String): Boolean

}
