package kz.saphena.api.model.organization

import jakarta.persistence.*
import kz.saphena.api.model.AbstractBaseAuditableEntity
import java.time.LocalDateTime

@Entity
class OrganizationApplication(
    var clinicName: String,
    var organizationName: String,
    var address: String,
    var phone: String,
    var email: String,
    var bin: String,
    var applicantFullName: String,
    var applicantIin: String,
    @Column(columnDefinition = "text")
    var comment: String? = null,
    @Enumerated(EnumType.STRING)
    var status: OrganizationApplicationStatus = OrganizationApplicationStatus.PENDING,
    @Column(columnDefinition = "text")
    var moderationComment: String? = null,
    var moderatedAt: LocalDateTime? = null,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    var organization: Organization? = null,
) : AbstractBaseAuditableEntity()
