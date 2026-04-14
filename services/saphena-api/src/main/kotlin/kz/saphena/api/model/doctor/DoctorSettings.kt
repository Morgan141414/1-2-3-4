package kz.saphena.api.model.doctor

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.math.BigDecimal
import kz.saphena.api.model.AbstractBaseAuditableEntity
import kz.saphena.api.model.organization.OrganizationUser

@Entity
@Table
class DoctorSettings(
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    val doctorId: OrganizationUser,

    @Column
    var doctorClientRatio: BigDecimal,

    @Column
    var clinicClientRatio: BigDecimal
) : AbstractBaseAuditableEntity()
