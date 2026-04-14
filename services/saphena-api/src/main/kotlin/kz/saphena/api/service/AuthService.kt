package kz.saphena.api.service

import kz.saphena.api.configuration.security.JwtUtils
import kz.saphena.api.dto.auth.CompleteRegistrationRequest
import kz.saphena.api.dto.auth.SignInRequest
import kz.saphena.api.dto.auth.SignInResponse
import kz.saphena.api.model.sms_challenge.SmsPurpose
import kz.saphena.api.model.user.User
import kz.saphena.api.model.user.UserRoleType
import kz.saphena.api.repository.PatientRepository
import kz.saphena.api.repository.organization.OrganizationUserRepository
import kz.saphena.api.repository.UserRepository
import kz.saphena.api.service.sms.SmsChallengeService
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val authenticationManager: AuthenticationManager,
    private val jwtUtils: JwtUtils,
    private val userRepository: UserRepository,
    private val organizationUserRepository: OrganizationUserRepository,
    private val patientRepository: PatientRepository,
    private val smsChallengeService: SmsChallengeService,
    private val passwordEncoder: PasswordEncoder,
) {

    fun authenticateUser(request: SignInRequest): SignInResponse {
        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.username.trim().lowercase(), request.password)
        )
        SecurityContextHolder.getContext().authentication = authentication

        val userDetails = authentication.principal as UserDetails
        val token = jwtUtils.generateToken(userDetails.username)

        val role = userDetails.authorities
            .stream()
            .map { obj: GrantedAuthority -> obj.authority }
            .toList()[0]

        val user = userRepository.findByUsername(request.username)
            ?: throw RuntimeException("User not found")
        val organizations = organizationUserRepository.findOrganizationsByUserId(user.getIdSafely())

        return SignInResponse(
            token = token,
            username = userDetails.username,
            role = role,
            organizationIds = organizations
                .map { o -> o.getIdSafely() }
        )
    }

    fun startRegistration(iin: String) {
        val patient = patientRepository.findByIin(iin)

        val eligible = patient != null
                && patient.phoneVerified
                && patient.userId == null
                && !patient.phone.isNullOrBlank()

        if (eligible) {
            smsChallengeService.createAndSend(
                phoneRaw = patient!!.phone!!,
                purpose = SmsPurpose.REGISTRATION
            )
        }
    }

    @Transactional
    fun completeRegistration(req: CompleteRegistrationRequest) {
        val iin = req.iin.trim()
        val code = req.code.trim()
        val password = req.password

        val patient = patientRepository.findByIin(iin)
            ?: throw IllegalArgumentException("Некорректные данные")

        if (patient.userId != null) throw IllegalStateException("Аккаунт уже создан")
        if (!patient.phoneVerified) throw IllegalStateException("Регистрация недоступна")
        val phone = patient.phone ?: throw IllegalStateException("Регистрация недоступна")

        val ok = smsChallengeService.verify(phone, SmsPurpose.REGISTRATION, code)
        if (!ok) throw IllegalArgumentException("Неверный код")

        if (userRepository.existsByUsername(iin)) {
            throw IllegalStateException("Аккаунт уже существует")
        }

        val user = User(
            username = iin,
            password = passwordEncoder.encode(password),
            role = UserRoleType.PATIENT,
            enabled = true,
        )

        val saved = userRepository.save(user)

        patient.userId = saved.id ?: throw IllegalStateException("User ID is null after save")
        patientRepository.save(patient)
    }

}