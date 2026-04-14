package kz.saphena.api.model.accounting

import jakarta.persistence.Entity
import kz.saphena.api.model.AbstractBaseAuditableEntity
import java.util.UUID

@Entity
class Vendor(
    val organizationId: UUID,
    var bin: String,
    var name: String?,
    var contactPersonName: String?,
    var contactPersonPhone: String?
) : AbstractBaseAuditableEntity()