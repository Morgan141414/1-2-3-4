package kz.saphena.api.model.patient

import io.hypersistence.utils.hibernate.type.json.JsonType
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.OneToMany
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import kz.saphena.api.model.AbstractBaseAuditableEntity
import org.hibernate.annotations.DynamicUpdate
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import java.time.LocalDate
import java.util.UUID

@Entity
@DynamicUpdate
@SQLDelete(sql = "update patient set deleted = true where id = ?")
class Patient(
    @Column(unique = true)
    val iin: String?,
    @Enumerated(EnumType.STRING)
    var iinVerificationStatus: PatientDocumentVerificationStatus,
    var isCitizen: Boolean,
    var firstName: String,
    var lastName: String,
    var middleName: String?,
    @Enumerated(EnumType.STRING)
    var gender: GenderType,
    var birthdate: LocalDate,
    @Type(JsonType::class)
    @Column(columnDefinition = "jsonb")
    var city: Kato?,
    var address: String?,
    var phone: String?,
    var phoneVerified: Boolean = false,
    var emergencyContact: String?,
    var email: String?,
    @OneToMany(
        mappedBy = "patient",
        cascade = [CascadeType.ALL],
        orphanRemoval = false,
        fetch = FetchType.LAZY
    )
    val documents: MutableList<PatientDocument> = mutableListOf(),
    var verificationComment: String? = null,
    var userId: UUID? = null
) : AbstractBaseAuditableEntity() {

    @PrePersist
    @PreUpdate
    fun validateCitizenState() {
        if (isCitizen && iin == null) {
            throw IllegalStateException("Citizen patient must have IIN")
        }
    }

    fun getActiveDocument(): PatientDocument? =
        documents.firstOrNull { it.isActive }

    fun addDocument(document: PatientDocument) {
        documents
            .filter { it.type == document.type && it.isActive }
            .forEach { it.isActive = false }

        documents.add(document)
    }

//    fun isVerified(): Boolean =
//        if (isCitizen) {
//            iinVerificationStatus !== PatientDocumentVerificationStatus.PROVIDED
//        } else {
//            getActiveDocument()?.verificationStatus !== PatientDocumentVerificationStatus.PROVIDED
//        }

}