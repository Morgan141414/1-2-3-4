package kz.saphena.api.model.schedule

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import kz.saphena.api.model.AbstractBaseAuditableEntity
import java.time.DayOfWeek
import java.time.LocalTime

@Entity
@Table(name = "work_pattern")
class WorkPatternEntity(

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    var schedule: WorkScheduleEntity? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var weekday: DayOfWeek,

    @Column(nullable = false)
    var startTime: LocalTime,

    @Column(nullable = false)
    var endTime: LocalTime
) : AbstractBaseAuditableEntity() {

    init {
        // Validate start time is before end time
        require(startTime.isBefore(endTime)) { "Start time must be before end time" }
    }
}
