package kz.saphena.api.model.doctor

import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import kz.saphena.api.model.AbstractBaseAuditableEntity
import kz.saphena.api.model.procedure.OrganizationProcedure
import org.hibernate.annotations.DynamicUpdate

@Entity
@DynamicUpdate
class DoctorProcedure(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doc_spec_id")
    val doctorSpecialization: DoctorSpecialization,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_procedure_id")
    val organizationProcedure: OrganizationProcedure,
    var price: Int?,
) : AbstractBaseAuditableEntity()
