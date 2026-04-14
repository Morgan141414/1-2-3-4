package kz.saphena.api.repository.appointment

import kz.saphena.api.model.appointment.Appointment
import org.javers.spring.annotation.JaversSpringDataAuditable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.UUID

@Repository
@JaversSpringDataAuditable
interface AppointmentRepository :
    JpaRepository<Appointment, UUID>,
    JpaSpecificationExecutor<Appointment> {

    @Query(
        value = """
            select a
            from Appointment a
            where a.status != 'CANCELLED'
              and a.organizationId = :organizationId
              and a.doctor.id = :doctorId
              and a.datetime between :startDate and :endDate
        """

    )
    fun findDoctorAppointmentsByOrganizationIdBetweenDates(
        organizationId: UUID,
        doctorId: UUID,
        startDate: LocalDateTime,
        endDate: LocalDateTime,
    ): List<Appointment>

    @Query(
        value = """
            select a
            from Appointment a
            where a.status != 'CANCELLED'
              and a.organizationId = :organizationId
              and a.roomId is not null 
              and a.datetime < :end
              and COALESCE(a.endDatetime, a.datetime) > :start
        """
    )
    fun findOverlappingWithRoomByOrganization(
        organizationId: UUID,
        start: LocalDateTime,
        end: LocalDateTime,
    ): List<Appointment>

    @Query(
        value = """
            select count(a) > 0
            from Appointment a
            where a.status != 'CANCELLED'
              and a.doctor.id = :doctorId
              and a.datetime < :end
              and a.endDatetime > :start
              and (:excludeId is null or :excludeId <> a.id)
        """
    )
    fun existsOverlappingAppointments(
        doctorId: UUID,
        start: LocalDateTime,
        end: LocalDateTime,
        excludeId: UUID?
    ): Boolean

    @Query(
        value = """
            select a.id from Appointment a 
            where a.organizationId = :organizationId
            and a.doctor.id = :doctorId
            and a.status = 'COMPLETED'
            and a.datetime >= :from and a.datetime <= :to
        """
    )
    fun findAllCompletedAppointmentIdsByOrganizationIdAndDoctorIdBetweenDates(
        organizationId: UUID,
        doctorId: UUID,
        from: LocalDateTime,
        to: LocalDateTime,
    ): List<UUID>

}
