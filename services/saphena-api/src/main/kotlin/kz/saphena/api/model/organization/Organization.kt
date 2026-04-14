package kz.saphena.api.model.organization

import jakarta.persistence.*
import kz.saphena.api.model.AbstractBaseAuditableEntity

@Entity
class Organization(
    @Column(unique = true)
    var clinicName: String,
    var organizationName: String,
    var address: String,
    var phone: String,
    var email: String,
    var bin: String?,
) : AbstractBaseAuditableEntity()
