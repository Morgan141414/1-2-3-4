package kz.saphena.api.model.specialization

import jakarta.persistence.Entity
import kz.saphena.api.model.AbstractBaseAuditableEntity
import org.hibernate.annotations.DynamicUpdate
import org.hibernate.annotations.SQLDelete

@Entity
@DynamicUpdate
@SQLDelete(sql = "UPDATE specialization SET deleted = true WHERE id = ?")
class Specialization(
    var name: String
) : AbstractBaseAuditableEntity()
