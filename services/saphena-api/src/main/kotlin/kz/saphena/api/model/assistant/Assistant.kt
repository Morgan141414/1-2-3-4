package kz.saphena.api.model.assistant

import jakarta.persistence.*
import kz.saphena.api.model.AbstractAuditableEntity
import kz.saphena.api.model.user.User
import java.util.UUID

@Entity
class Assistant(
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    val user: User,
    val organizationId: UUID,
    @ElementCollection
    @CollectionTable(
        name = "assistant_type",
        joinColumns = [JoinColumn(name = "assistant_id")]
    )
    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    var types: MutableSet<AssistantType>,
    var firstName: String,
    var lastName: String,
    var middleName: String?
) : AbstractAuditableEntity() {
    @Id
    var id: UUID? = null

    fun getIdSafely(): UUID {
        return id ?: throw IllegalStateException("Entity of type ${this.javaClass.name} cannot have null id")
    }
}
