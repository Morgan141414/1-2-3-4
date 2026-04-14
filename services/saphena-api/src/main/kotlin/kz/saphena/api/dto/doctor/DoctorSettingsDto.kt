package kz.saphena.api.dto.doctor

import java.math.BigDecimal
import java.util.UUID
import kz.saphena.api.model.doctor.DoctorSettings

data class DoctorSettingsRequest(
    val doctorClientRatio: BigDecimal,
    val clinicClientRatio: BigDecimal
)

data class DoctorSettingsResponse(
    val id: UUID,
    val doctorId: UUID,
    val doctorClientRatio: BigDecimal,
    val clinicClientRatio: BigDecimal
)

fun DoctorSettings.toResponse() = DoctorSettingsResponse(
    id = this.getIdSafely(),
    doctorId = this.doctorId.getIdSafely(),
    doctorClientRatio = this.doctorClientRatio,
    clinicClientRatio = this.clinicClientRatio
)
