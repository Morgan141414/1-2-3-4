package kz.saphena.api.repository

import kz.saphena.api.model.user.User
import kz.saphena.api.model.user.UserRoleType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface UserRepository : JpaRepository<User, UUID> {

    fun findByUsername(username: String): User?

    fun existsByUsername(username: String): Boolean

    fun findByRole(role: UserRoleType): List<User>
}
