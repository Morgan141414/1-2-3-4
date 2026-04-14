package kz.saphena.api.model.appointment

import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import kz.saphena.api.model.AbstractBaseAuditableEntity
import kz.saphena.api.model.procedure.Procedure
import java.util.UUID

@Entity
class AppointmentProcedure(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    val appointment: Appointment,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "procedure_id")
    val procedure: Procedure,
    val actualPrice: Long?,
    @Enumerated(EnumType.STRING)
    var status: AppointmentProcedureStatusType
) : AbstractBaseAuditableEntity()
