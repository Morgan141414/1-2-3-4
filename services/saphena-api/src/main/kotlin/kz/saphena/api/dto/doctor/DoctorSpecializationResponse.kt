package kz.saphena.api.dto.doctor

import kz.saphena.api.dto.specialization.SpecializationResponse
import kz.saphena.api.dto.specialization.toSpecializationResponse
import kz.saphena.api.model.doctor.Doctor
import kz.saphena.api.model.doctor.DoctorSpecialization
import java.util.UUID

data class DoctorSpecializationResponse (
    val id: UUID,
    val specialization: SpecializationResponse,
    val doctor: DoctorResponse?,
)

fun DoctorSpecialization.toDoctorSpecializationResponse(
    doctor: Doctor?,
) = DoctorSpecializationResponse(
    id = getIdSafely(),
    specialization = specialization.toSpecializationResponse(),
    doctor = doctor?.toDoctorResponse(
        orgUserId = orgUser.getIdSafely()
    )
)