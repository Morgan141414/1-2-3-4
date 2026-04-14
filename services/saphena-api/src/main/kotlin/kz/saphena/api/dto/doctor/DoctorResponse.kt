package kz.saphena.api.dto.doctor

import kz.saphena.api.dto.user.UserResponse
import kz.saphena.api.model.doctor.Doctor
import java.util.UUID

data class DoctorResponse(
    val id: UUID,
    val firstName: String,
    val lastName: String,
    val middleName: String?,
    val iin: String?,
    val phone: String?,
    val email: String?,
    val user: UserResponse?,
    val orgUserId: UUID?
)

fun Doctor.toDoctorResponse(
    orgUserId: UUID?,
    includeUser: Boolean = false
) = DoctorResponse(
    id = getIdSafely(),
    iin = iin,
    firstName = firstName,
    lastName = lastName,
    middleName = middleName,
    phone = phone,
    email = email,
    orgUserId = orgUserId,
    user = if (includeUser) {
        UserResponse(
            id = user.getIdSafely(),
            username = user.username,
            role = user.role
        )
    } else null
)
