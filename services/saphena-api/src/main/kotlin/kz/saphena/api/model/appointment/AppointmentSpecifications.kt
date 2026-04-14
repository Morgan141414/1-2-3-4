package kz.saphena.api.model.appointment

import jakarta.persistence.criteria.JoinType
import kz.saphena.api.model.patient.Patient
import kz.saphena.api.model.patient.PatientDocument
import org.springframework.data.jpa.domain.Specification
import java.time.LocalDate
import java.util.*

object AppointmentSpecifications {

    fun hasOrganization(orgId: UUID?) = Specification<Appointment> { root, _, cb ->
        orgId?.let { cb.equal(root.get<UUID>("organizationId"), orgId) }
    }

    fun hasDoctor(doctorId: UUID?) = Specification<Appointment> { root, _, cb ->
        doctorId?.let { cb.equal(root.get<UUID>("doctor").get<UUID>("id"), doctorId) }
    }

    fun hasPatient(patientId: UUID?) = Specification<Appointment> { root, _, cb ->
        patientId?.let { cb.equal(root.get<UUID>("patient").get<UUID>("id"), patientId) }
    }

    fun hasStatus(status: AppointmentStatusType?) = Specification<Appointment> { root, _, cb ->
        status?.let { cb.equal(root.get<AppointmentStatusType>("status"), status) }
    }

    fun dateFrom(from: LocalDate?) = Specification<Appointment> { root, _, cb ->
        from?.let {
            cb.greaterThanOrEqualTo(
                root.get("datetime"),
                from.atStartOfDay()
            )
        }
    }

    fun dateTo(to: LocalDate?) = Specification<Appointment> { root, _, cb ->
        to?.let {
            cb.lessThan(
                root.get("datetime"),
                to.plusDays(1).atStartOfDay()
            )
        }
    }

    fun search(text: String?) = Specification<Appointment> { root, query, cb ->
        val search = text
            ?.trim()
            ?.lowercase()
            ?: return@Specification null

        query?.distinct(true)

        val pattern = "%$search%"

        val patientJoin = root.join<Appointment, Patient>(
            "patient",
            JoinType.LEFT
        )
        val documentJoin = patientJoin.join<Patient, PatientDocument>(
            "documents",
            JoinType.LEFT
        )

        cb.or(
            // registered patient
            cb.like(cb.lower(patientJoin.get("iin")), pattern),
            cb.like(cb.lower(patientJoin.get("firstName")), pattern),
            cb.like(cb.lower(patientJoin.get("lastName")), pattern),
            cb.like(cb.lower(documentJoin.get("documentNumber")), pattern),

            // temporary patient
            cb.like(cb.lower(root.get("tempPatientName")), pattern),
            cb.like(cb.lower(root.get("tempPatientPhone")), pattern),
        )
    }
}
