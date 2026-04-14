package kz.saphena.api.service

import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.dto.auth.ChangePasswordRequest
import kz.saphena.api.model.user.User
import kz.saphena.api.repository.UserRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class MeService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
) {

    fun me(): User {
        val principal = SecurityContextHolder.getContext().authentication.principal as UserDetails
        return userRepository.findByUsername(principal.username) ?: throw EntityNotFoundException("User Not Found")
    }

    fun changePassword(request: ChangePasswordRequest) {
        val me = me()
        val user = userRepository.findByIdOrNull(me.id)
            ?: throw EntityNotFoundException("User not found: ${me.id}")

        val currentHash = user.password
        if (!passwordEncoder.matches(request.oldPassword, currentHash)) {
            throw IllegalArgumentException("Старый пароль неверный")
        }

        if (passwordEncoder.matches(request.newPassword, currentHash)) {
            throw IllegalArgumentException("Новый пароль должен отличаться от старого")
        }

        user.password = passwordEncoder.encode(request.newPassword)
        userRepository.save(user)
    }

}