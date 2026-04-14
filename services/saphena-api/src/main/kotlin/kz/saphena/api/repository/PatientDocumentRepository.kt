package kz.saphena.api.repository

import kz.saphena.api.model.patient.PatientDocument
import kz.saphena.api.model.patient.PatientDocumentType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface PatientDocumentRepository: JpaRepository<PatientDocument, UUID> {

    fun existsByTypeAndDocumentNumberAndIsActiveTrue(
        type: PatientDocumentType,
        documentNumber: String
    ): Boolean

}
