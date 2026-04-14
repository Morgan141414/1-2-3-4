package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.protocol.CreateProtocolRequest
import kz.saphena.api.model.patient.GenderType
import kz.saphena.api.model.protocol.ProtocolTargetType
import kz.saphena.api.service.ProtocolService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/protocols")
class ProtocolController(
    private val protocolService: ProtocolService
) {

    @GetMapping
    fun getActiveProtocol(
        @RequestParam(required = false)
        targetType: ProtocolTargetType,
        @RequestParam(required = false)
        targetId: UUID,
        @RequestParam(required = false)
        gender: GenderType?,
    ) = protocolService.getActiveProtocol(
        targetType = targetType,
        targetId = targetId,
        gender = gender
    )

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_SUPERADMIN', 'ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun createProtocol(
        @RequestParam(required = false)
        targetType: ProtocolTargetType,
        @RequestParam(required = false)
        targetId: UUID,
        @RequestBody @Valid
        request: CreateProtocolRequest
    ) = protocolService.createOrUpdateProtocol(
        targetType = targetType,
        targetId = targetId,
        request = request,
    )

    @PostMapping("reset")
    @PreAuthorize("hasAnyRole('ROLE_SUPERADMIN', 'ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN')")
    fun resetProtocol(
        @RequestParam(required = false)
        targetType: ProtocolTargetType,
        @RequestParam(required = false)
        targetId: UUID,
    ) = protocolService.resetProtocolToTemplate(
        targetType = targetType,
        targetId = targetId,
    )

}
