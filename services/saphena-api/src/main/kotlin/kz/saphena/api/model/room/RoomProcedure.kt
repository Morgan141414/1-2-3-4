package kz.saphena.api.model.room

import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import kz.saphena.api.model.AbstractBaseAuditableEntity
import kz.saphena.api.model.procedure.OrganizationProcedure
import java.util.UUID

@Entity
class RoomProcedure(
    val roomId: UUID,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_procedure_id")
    val organizationProcedure: OrganizationProcedure
) : AbstractBaseAuditableEntity()
