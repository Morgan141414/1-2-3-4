package kz.saphena.api.model.spec_doc

import jakarta.persistence.Entity
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import kz.saphena.api.model.AbstractBaseAuditableEntity
import org.hibernate.annotations.SQLDelete
import java.util.*

@Entity
@SQLDelete(sql = "update organization_specialization_document set deleted = true where id = ?")
class OrganizationSpecializationDocument(
    @ManyToOne
    @JoinColumn(name = "specialization_document_id")
    val specializationDocument: SpecializationDocument,
    val organizationId: UUID,
) : AbstractBaseAuditableEntity()
