package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.auth.ChangePasswordRequest
import kz.saphena.api.service.MeService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/me")
class MeController(
    private val meService: MeService
) {

    @PostMapping("/password")
    fun changePassword(
        @RequestBody @Valid
        request: ChangePasswordRequest
    ) = meService.changePassword(request)

}