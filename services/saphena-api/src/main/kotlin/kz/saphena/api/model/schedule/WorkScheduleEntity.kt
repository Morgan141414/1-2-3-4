package kz.saphena.api.model.schedule

import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import kz.saphena.api.model.AbstractBaseAuditableEntity
import kz.saphena.api.model.organization.OrganizationUser
import java.time.LocalDate

/**
 * Entity representing a doctor's work schedule that can span multiple days.
 * Links to up to 7 DoctorWorkPattern entities (one for each day of the week).
 */
@Entity
@Table(name = "work_schedule")
class WorkScheduleEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_user_id", nullable = false)
    var orgUser: OrganizationUser,

    @Column(nullable = false)
    var name: String,

    @Column(name = "start_date", nullable = false)
    var startDate: LocalDate,

    @Column(name = "end_date")
    var endDate: LocalDate? = null,

    @OneToMany(mappedBy = "schedule", cascade = [CascadeType.ALL], orphanRemoval = true)
    var workPatterns: MutableList<WorkPatternEntity> = mutableListOf()
) : AbstractBaseAuditableEntity() {
    
    /**
     * Adds a work pattern to this schedule
     */
    fun addWorkPattern(workPattern: WorkPatternEntity) {
        workPattern.schedule = this
        workPatterns.add(workPattern)
    }
}
