package kz.saphena.api.repository.appointment

import kz.saphena.api.model.appointment.AppointmentProcedure

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.math.BigDecimal
import java.util.UUID

@Repository
interface AppointmentProcedureRepository : JpaRepository<AppointmentProcedure, UUID> {

    @Query("""
        select ap
        from AppointmentProcedure ap
        where ap.appointment.id = :appointmentId
        order by ap.createdAt
    """)
    fun findByAppointmentId(appointmentId: UUID): List<AppointmentProcedure>

    @Query("""
        select ap
        from AppointmentProcedure ap
        where ap.appointment.id = :appointmentId
            and ap.procedure.id = :procedureId
    """)
    fun findByAppointmentIdAndProcedureId(
        appointmentId: UUID,
        procedureId: UUID,
    ): AppointmentProcedure

    @Query("""
        select coalesce(sum(ap.actualPrice), 0) 
        from AppointmentProcedure ap 
        where ap.appointment.id in (:appointmentIds)
    """)
    fun getTotalIncomeSumByAppointmentIds(appointmentIds: List<UUID>): BigDecimal

    fun findAllByAppointmentIdIn(ids: List<UUID>): List<AppointmentProcedure>

}
