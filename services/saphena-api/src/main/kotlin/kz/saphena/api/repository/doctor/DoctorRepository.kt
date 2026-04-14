package kz.saphena.api.repository.doctor

import kz.saphena.api.model.doctor.Doctor
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.UUID

interface DoctorRepository: JpaRepository<Doctor, UUID> {

    @Query("""
        select d 
        from Doctor d
    """)
    fun findDoctors(pageable: Pageable): Page<Doctor>

    @Query("""
        select d
        from Doctor d
        join OrganizationUser ou on ou.user.id = d.id
        where ou.organization.id = :organizationId
            and ou.deleted = false
    """)
    fun findByOrganizationId(organizationId: UUID,
                             pageable: Pageable): Page<Doctor>

    @Query("""
        select d
        from Doctor d
        join DoctorSpecialization ds on ds.orgUser.user.id = d.id
        join OrganizationUser ou on ou.user.id = d.id
        where ou.organization.id = :organizationId
            and ds.specialization.id = :specializationId
            and d.deleted = false
    """)
    fun findAllByOrganizationIdAndSpecializationId(organizationId: UUID,
                                                   specializationId: UUID): List<Doctor>

    fun findByIin(iin: String): Doctor?
}