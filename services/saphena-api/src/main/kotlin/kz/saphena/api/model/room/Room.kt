package kz.saphena.api.model.room

import jakarta.persistence.Entity
import kz.saphena.api.model.AbstractBaseAuditableEntity
import java.util.UUID

@Entity
class Room(
    val organizationId: UUID,
    var code: String,
    var name: String,
) : AbstractBaseAuditableEntity()
