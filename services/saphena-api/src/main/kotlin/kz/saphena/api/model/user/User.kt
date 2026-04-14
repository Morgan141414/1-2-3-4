package kz.saphena.api.model.user

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import kz.saphena.api.model.AbstractBaseAuditableEntity

@Entity
@Table(name = "app_user")
class User(
    @Enumerated(EnumType.STRING)
    val role: UserRoleType,
    @Column(unique = true)
    val username: String,
    @JsonIgnore
    var password: String,
    var enabled: Boolean = true
) : AbstractBaseAuditableEntity()
