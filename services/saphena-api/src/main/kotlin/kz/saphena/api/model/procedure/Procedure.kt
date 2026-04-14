package kz.saphena.api.model.procedure

import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import kz.saphena.api.model.AbstractBaseAuditableEntity
import org.hibernate.annotations.DynamicUpdate
import org.hibernate.annotations.SQLDelete
import java.util.UUID

@Entity
@DynamicUpdate
@SQLDelete(sql = "UPDATE procedure SET deleted = true WHERE id = ?")
class Procedure(
    val specializationId: UUID,
    var name: String,
    @Enumerated(EnumType.STRING)
    var type: ProcedureType,
    var key: String? = null,
    var nameKk: String? = null,
    var nameEn: String? = null,
) : AbstractBaseAuditableEntity() {

    fun getLocalizedName(lang: String): String =
        when (lang.lowercase()) {
            "kk" -> nameKk ?: name
            "en" -> nameEn ?: name
            else -> name
        }

}
