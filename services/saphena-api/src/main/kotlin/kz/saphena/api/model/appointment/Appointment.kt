package kz.saphena.api.model.appointment

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.validation.constraints.AssertTrue
import kz.saphena.api.model.AbstractBaseAuditableEntity
import kz.saphena.api.model.doctor.Doctor
import kz.saphena.api.model.patient.Patient
import org.hibernate.annotations.SQLRestriction
import java.time.LocalDateTime
import java.util.UUID

@Entity
@SQLRestriction("deleted = false")
class Appointment(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    val doctor: Doctor, // Удалить в будущем, так как маппинг теперь через orgUserId
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    var patient: Patient?,
    @Enumerated(EnumType.STRING)
    var status: AppointmentStatusType,
    val organizationId: UUID, // Удалить в будущем, так как маппинг теперь через orgUserId
    val specializationId: UUID,
    var datetime: LocalDateTime,
    var endDatetime: LocalDateTime?,
    var comment: String?,
    @Column(name = "room_id")
    var roomId: UUID?,
    @Enumerated(EnumType.STRING)
    var clientOwnership: ClientOwnershipType = ClientOwnershipType.CLINIC,
    val orgUserId: UUID,
    var tempPatientName: String?,
    var tempPatientPhone: String?,
    @Enumerated(EnumType.STRING)
    var paymentType: PaymentType = PaymentType.NOT_DEFINED,
    @Enumerated(EnumType.STRING)
    var paymentStatus: PaymentStatusType = PaymentStatusType.UNPAID,
) : AbstractBaseAuditableEntity() {

    @AssertTrue(message = "Either patient OR temp patient data must be provided, but not both")
    fun isPatientValid(): Boolean {
        val hasPatient = patient != null
        val hasTempPatient = !tempPatientName.isNullOrBlank() && !tempPatientPhone.isNullOrBlank()

        return hasPatient.xor(hasTempPatient)
    }
}
