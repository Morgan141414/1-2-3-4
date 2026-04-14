package kz.saphena.api.repository.notification

import kz.saphena.api.model.notification.NotificationEntity
import kz.saphena.api.model.notification.NotifyStatus
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDate
import java.util.UUID

@Repository
interface NotificationRepository : JpaRepository<NotificationEntity, UUID> {
    fun findByAppointmentId(appointmentId: UUID): List<NotificationEntity>

    @Query("SELECT n FROM NotificationEntity n WHERE n.status = :status AND DATE(n.scheduledAt) = :date")
    fun findByStatusAndScheduledAtDate(status: NotifyStatus, date: LocalDate): List<NotificationEntity>
}
