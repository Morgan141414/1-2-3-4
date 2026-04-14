package kz.saphena.api.controller

import jakarta.validation.Valid
import java.util.UUID
import kz.saphena.api.dto.protocol.CreateProtocolDataRequest
import kz.saphena.api.dto.protocol.UpdateProtocolDataRequest
import kz.saphena.api.model.protocol.ProtocolTargetType
import kz.saphena.api.service.EventPublishingService
import kz.saphena.api.service.ProtocolDataService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/protocol-data")
class ProtocolDataController(
    private val protocolDataService: ProtocolDataService,
    private val publishingService: EventPublishingService
) {

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_DOCTOR', 'ROLE_PATIENT')")
    fun getProtocolData(
        @RequestParam(required = true)
        targetType: ProtocolTargetType,
        @RequestParam(required = true)
        targetId: UUID,
        @RequestParam(required = true)
        appointmentId: UUID
    ) = protocolDataService.getProtocolData(
        targetType = targetType,
        targetId = targetId,
        appointmentId = appointmentId,
    )

    @PostMapping("procedure")
    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    fun saveProcedureProtocolData(
        @RequestBody @Valid
        request: CreateProtocolDataRequest,
    ) = run {
        val protocolData = protocolDataService.saveProcedureProtocolData(request)
        publishingService.publishProtocolDataEvents(protocolData)
    }

    @PostMapping("spec-doc")
    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    fun saveSpecializationDocumentProtocolData(
        @RequestBody @Valid
        request: CreateProtocolDataRequest
    ) = protocolDataService.saveSpecializationDocumentProtocolData(request)

    @PostMapping("org-doc")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ORGANIZATION_ADMIN', 'ROLE_RECEPTIONIST')")
    fun saveOrganizationDocumentProtocolData(
        @RequestBody @Valid
        request: CreateProtocolDataRequest,
        @RequestParam(defaultValue = "ru")
        lang: String
    ) = protocolDataService.saveOrganizationDocumentProtocolData(request, lang)

    @PutMapping("{id}")
    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    fun updateProtocolData(
        @PathVariable id: UUID,
        @RequestBody @Valid
        request: UpdateProtocolDataRequest
    ) = run {
        val protocolData = protocolDataService.updateProtocolData(id, request)
        publishingService.publishProtocolDataEvents(protocolData)
    }

    @GetMapping("appointment-specialization-documents")
    @PreAuthorize("hasAnyRole('ROLE_DOCTOR', 'ROLE_PATIENT')")
    fun getAppointmentSpecializationDocuments(
        @RequestParam(required = true)
        appointmentId: UUID,
    ) = protocolDataService.getAppointmentSpecializationDocuments(appointmentId)

}
