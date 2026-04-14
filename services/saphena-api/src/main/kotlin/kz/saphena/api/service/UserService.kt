package kz.saphena.api.service

import jakarta.persistence.EntityExistsException
import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.dto.user.CreateUserRequestRequest
import kz.saphena.api.dto.user.UpdateUserRequest
import kz.saphena.api.dto.user.UserResponse
import kz.saphena.api.model.user.User
import kz.saphena.api.model.user.UserRoleType
import kz.saphena.api.repository.UserRepository
import org.springframework.boot.ansi.AnsiOutput.Enabled
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.util.*

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val meService: MeService
) {

    fun createUser(request: CreateUserRequestRequest,
                   role: UserRoleType,
                   enabled: Boolean = true): User {
        if (userRepository.existsByUsername(request.username)) {
            throw EntityExistsException("User ${request.username} already exists")
        }

        return userRepository.save(
            User(
                username = request.username.trim().lowercase(),
                password = passwordEncoder.encode(request.password),
                role = role,
                enabled = enabled
            )
        )
    }

    fun getUser(id: UUID): UserResponse {
        return userRepository.findByIdOrNull(id)?.let {
            UserResponse(
                id = it.getIdSafely(),
                username = it.username,
                role = it.role
            )
        } ?: throw EntityNotFoundException("User Not Found")
    }

    fun updateUser(id: UUID,
                   request: UpdateUserRequest) {
        val user = userRepository.findByIdOrNull(id) ?: throw EntityNotFoundException("User Not Found")

        if (user.role == UserRoleType.SUPERADMIN) {
            throw EntityNotFoundException("User Not Found")
        }

        val me = meService.me()
        if (me.role == UserRoleType.ORGANIZATION_ADMIN && user.role == UserRoleType.ORGANIZATION_ADMIN) {
            throw EntityNotFoundException("User Not Found")
        }
        if (me.role == UserRoleType.ORGANIZATION_ADMIN && user.role == UserRoleType.CEO) {
            throw EntityNotFoundException("User Not Found")
        }

        userRepository.save(
            user.also {
                it.password = passwordEncoder.encode(request.password)
            }
        )
    }

    fun deleteUser(id: UUID) {
        val user = userRepository.findByIdOrNull(id) ?: throw EntityNotFoundException("User with id $id not found")

        if (user.role == UserRoleType.SUPERADMIN) {
            throw EntityNotFoundException("User Not Found")
        }

        userRepository.save(
            user.also {
                it.enabled = false
                it.markDeleted()
            }
        )
    }
}