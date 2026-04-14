package kz.saphena.api.model.doctor

import jakarta.persistence.*
import kz.saphena.api.model.AbstractAuditableEntity
import kz.saphena.api.model.user.User
import org.hibernate.annotations.DynamicUpdate
import java.util.UUID

@Entity
@DynamicUpdate
class Doctor(
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    val user: User,
    @Column(unique = true)
    var iin: String,
    var firstName: String,
    var lastName: String,
    var middleName: String?,
    var phone: String?,
    var email: String?,
) : AbstractAuditableEntity() {
    @Id
    var id: UUID? = null

    fun getIdSafely(): UUID {
        return id ?: throw IllegalStateException("Entity of type ${this.javaClass.name} cannot have null id")
    }
}
