package kz.saphena.api.repository

import jakarta.persistence.LockModeType
import kz.saphena.api.model.patient.Patient
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Lock
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface PatientRepository: JpaRepository<Patient, UUID> {

    @Query("""
        select distinct p
        from Patient p
        left join p.documents d
            on d.isActive = true
        where p.deleted = false
            and (
                :search IS NULL OR
                LOWER(p.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(p.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(p.middleName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(p.iin) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(d.documentNumber) LIKE LOWER(CONCAT('%', :search, '%'))
            )
    """)
    fun findPatients(pageable: Pageable,
                     search: String): Page<Patient>

    fun existsByIin(iin: String): Boolean

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        select p 
        from Patient p 
        where p.id = :id
    """)
    fun findByIdForUpdate(id: UUID): Patient?

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        select p 
        from Patient p 
        where p.phone = :phone
    """)
    fun findByPhoneForUpdate(phone: String): Patient?

    fun findByUserId(userId: UUID): Patient?

    fun findByIin(iin: String): Patient?

}
