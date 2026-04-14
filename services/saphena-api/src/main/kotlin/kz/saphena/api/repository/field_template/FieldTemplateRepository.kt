package kz.saphena.api.repository.field_template

import kz.saphena.api.model.field_template.FieldTemplate
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface FieldTemplateRepository : JpaRepository<FieldTemplate, UUID> {

    fun findAllByUserIdAndDocumentIdAndFieldKey(userId: UUID,
                                                documentId: UUID,
                                                fieldKey: String): List<FieldTemplate>

}
