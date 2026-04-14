package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.user.UpdateUserRequest
import kz.saphena.api.service.UserService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {

    @GetMapping("{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_SUPERADMIN', 'ROLE_ORGANIZATION_ADMIN')")
    fun getUser(
        @PathVariable
        id: UUID
    ) = userService.getUser(id)

    @PutMapping("{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_SUPERADMIN', 'ROLE_ORGANIZATION_ADMIN')")
    fun updateUser(
        @PathVariable
        id: UUID,
        @RequestBody @Valid
        request: UpdateUserRequest
    ) = userService.updateUser(
        id = id,
        request = request,
    )

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun deleteUser(
        @PathVariable("id")
        id: UUID
    ) = userService.deleteUser(id)

}