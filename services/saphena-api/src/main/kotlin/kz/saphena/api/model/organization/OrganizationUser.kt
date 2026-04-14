package kz.saphena.api.model.organization

import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import kz.saphena.api.model.AbstractBaseAuditableEntity
import kz.saphena.api.model.user.User

@Entity
class OrganizationUser(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    val user: User,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    val organization: Organization
) : AbstractBaseAuditableEntity()
