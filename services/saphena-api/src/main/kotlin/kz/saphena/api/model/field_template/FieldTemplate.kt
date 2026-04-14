package kz.saphena.api.model.field_template

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import java.util.*

@Entity
class FieldTemplate(
    @Id
    @Column(nullable = false)
    var id: UUID = UUID.randomUUID(),

    @Column(nullable = false)
    var userId: UUID,

    @Column(nullable = false)
    var documentId: UUID,

    @Column(nullable = false, length = 100)
    var fieldKey: String,

    @Column(nullable = false, length = 100)
    var name: String,

    @Column(nullable = false)
    var content: String,
)
