package kz.saphena.api.model.schedule

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import kz.saphena.api.model.AbstractBaseAuditableEntity
import kz.saphena.api.model.organization.OrganizationUser
import java.time.LocalDate

@Entity
@Table(name = "schedule_exception")
class ScheduleException(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_user_id", nullable = false)
    val orgUser: OrganizationUser,

    @Column(nullable = false)
    val startDate: LocalDate,

    @Column(nullable = false)
    val endDate: LocalDate,

    val note: String? = null
) : AbstractBaseAuditableEntity() {

    init {
        // Validate start date is not after end date
        require(!startDate.isAfter(endDate)) { "Start date must not be after end date" }
    }
}
