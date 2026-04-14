package kz.saphena.api.model.patient

import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import kz.saphena.api.model.AbstractBaseAuditableEntity
import org.hibernate.annotations.DynamicUpdate
import org.hibernate.annotations.SQLDelete
import java.time.LocalDate

@Entity
@DynamicUpdate
@SQLDelete(sql = "update patient_document set deleted = true where id = ?")
class PatientDocument(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    val patient: Patient,
    @Enumerated(EnumType.STRING)
    val type: PatientDocumentType,
    val documentNumber: String?,
    val issuedAt: LocalDate?,
    val expiresAt: LocalDate?,
    var isActive: Boolean = true,
    @Enumerated(EnumType.STRING)
    var verificationStatus: PatientDocumentVerificationStatus,
    var verificationComment: String? = null,
) : AbstractBaseAuditableEntity()