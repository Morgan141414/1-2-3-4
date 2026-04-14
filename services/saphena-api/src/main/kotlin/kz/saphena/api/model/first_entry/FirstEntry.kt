package kz.saphena.api.model.first_entry

import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import kz.saphena.api.model.AbstractBaseAuditableEntity
import java.util.UUID

@Entity
class FirstEntry(
    val patientId: UUID,
    val organizationId: UUID,
    @Enumerated(EnumType.STRING)
    val trafficSource: TrafficSourceType
) : AbstractBaseAuditableEntity()
