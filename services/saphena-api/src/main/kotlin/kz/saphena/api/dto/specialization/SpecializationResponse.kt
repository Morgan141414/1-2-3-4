package kz.saphena.api.dto.specialization

import kz.saphena.api.model.specialization.Specialization
import java.util.UUID

data class SpecializationResponse(
    val id: UUID,
    val name: String,
    val deleted: Boolean,
)

fun Specialization.toSpecializationResponse() = SpecializationResponse(
    id = getIdSafely(),
    name = name,
    deleted = deleted,
)
