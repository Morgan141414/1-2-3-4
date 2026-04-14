package kz.saphena.api.model.doctor

import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import kz.saphena.api.model.AbstractBaseAuditableEntity
import kz.saphena.api.model.organization.OrganizationUser
import kz.saphena.api.model.specialization.Specialization

@Entity
class DoctorSpecialization(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_user_id")
    val orgUser: OrganizationUser,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialization_id")
    val specialization: Specialization,
) : AbstractBaseAuditableEntity()
