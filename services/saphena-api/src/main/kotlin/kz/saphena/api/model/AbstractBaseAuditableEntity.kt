package kz.saphena.api.model

import jakarta.persistence.*
import java.io.Serializable
import java.util.*

@MappedSuperclass
abstract class AbstractBaseAuditableEntity : AbstractAuditableEntity(), Serializable {

    @Id
    @Column(updatable = false, nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null

    fun getIdSafely(): UUID {
        return id ?: throw IllegalStateException("Entity of type ${this.javaClass.name} cannot have null id")
    }

}
