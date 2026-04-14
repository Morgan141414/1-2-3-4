package kz.saphena.api.model.accounting

import jakarta.persistence.Entity
import kz.saphena.api.model.AbstractBaseAuditableEntity
import java.util.UUID

@Entity
class ExpenseType(
    val organizationId: UUID,
    var name: String
) : AbstractBaseAuditableEntity()