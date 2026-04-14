package kz.saphena.api.model.organization

import jakarta.persistence.Entity
import kz.saphena.api.model.AbstractBaseAuditableEntity
import org.hibernate.annotations.DynamicUpdate
import org.hibernate.annotations.SQLDelete
import java.util.*

@Entity
@DynamicUpdate
@SQLDelete(sql = "UPDATE organization_document SET deleted = true WHERE id = ?")
class OrganizationDocument(
    val organizationId: UUID,
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
