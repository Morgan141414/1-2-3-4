package kz.saphena.api.model

import jakarta.persistence.Entity

@Entity
class Mkb10(
    var key: String,
    var name: String
) : AbstractBaseAuditableEntity()