package kz.saphena.api.dto.procedure

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import kz.saphena.api.model.procedure.ProcedureType

data class CreateProcedureRequest(
    @get:NotBlank
    val name: String,
    @get:NotNull
    val type: ProcedureType,
    val key: String?,
    val nameKk: String?,
    val nameEn: String?,
)
