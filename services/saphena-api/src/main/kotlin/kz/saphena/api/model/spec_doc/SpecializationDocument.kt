package kz.saphena.api.model.spec_doc

import jakarta.persistence.Entity
import kz.saphena.api.model.AbstractBaseAuditableEntity
import org.hibernate.annotations.DynamicUpdate
import org.hibernate.annotations.SQLDelete
import java.util.*

@Entity
@DynamicUpdate
@SQLDelete(sql = "UPDATE specialization_document SET deleted = true WHERE id = ?")
class SpecializationDocument(
    val specializationId: UUID,
    var name: String,
    var nameKk: String? = null,
    var nameEn: String? = null
) : AbstractBaseAuditableEntity() {

    fun getLocalizedName(lang: String): String =
        when (lang.lowercase()) {
            "kk" -> nameKk ?: name
            "en" -> nameEn ?: name
            else -> name
        }
}
