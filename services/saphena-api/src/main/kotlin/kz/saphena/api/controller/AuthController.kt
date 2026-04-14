package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.auth.CompleteRegistrationRequest
import kz.saphena.api.dto.auth.SignInRequest
import kz.saphena.api.dto.auth.StartRegistrationRequest
import kz.saphena.api.service.AuthService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("/sign-in")
    fun signIn(
        @RequestBody @Valid
        request: SignInRequest
    ) = authService.authenticateUser(request)

    @PostMapping("/registration/start")
    fun startRegistration(
        @RequestBody @Valid
        req: StartRegistrationRequest
    ) = authService.startRegistration(req.iin)

    @PostMapping("/registration/complete")
    fun completeRegistration(
        @RequestBody @Valid
        req: CompleteRegistrationRequest
    ) = authService.completeRegistration(req)

}