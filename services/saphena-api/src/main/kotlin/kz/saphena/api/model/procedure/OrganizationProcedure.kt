package kz.saphena.api.model.procedure

import jakarta.persistence.Entity
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import kz.saphena.api.model.AbstractBaseAuditableEntity
import org.hibernate.annotations.DynamicUpdate
import org.hibernate.annotations.SQLDelete
import java.util.*

@Entity
@DynamicUpdate
@SQLDelete(sql = "update organization_procedure set deleted = true where id = ?")
class OrganizationProcedure(
    @ManyToOne
    @JoinColumn(name = "procedure_id")
    val procedure: Procedure,
    val organizationId: UUID,
    var roomRequired: Boolean,
) : AbstractBaseAuditableEntity()
