package kz.saphena.api.controller

import jakarta.validation.Valid
import kz.saphena.api.dto.procedure.CreateProcedureRequest
import kz.saphena.api.service.ProcedureService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/procedures")
class ProcedureController(
    private val procedureService: ProcedureService
) {

    @GetMapping
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun getProcedures(
        @RequestParam(required = true)
        specializationId: UUID,
    ) = procedureService.getProcedures(specializationId)

    @PostMapping
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun createProcedure(
        @RequestParam(required = true)
        specializationId: UUID,
        @RequestBody @Valid
        request: CreateProcedureRequest,
    ) = procedureService.createProcedure(specializationId, request)

    @GetMapping("{id}")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun getProcedure(
        @PathVariable id: UUID
    ) = procedureService.getProcedure(id)

    @PutMapping("{id}")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun updateProcedure(
        @PathVariable
        id: UUID,
        @RequestBody @Valid
        request: CreateProcedureRequest,
    ) = procedureService.updateProcedure(id, request)

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun deleteProcedure(
        @PathVariable
        id: UUID,
    ) = procedureService.deleteProcedure(id)

    @PatchMapping("{id}/restore")
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun restoreProcedure(
        @PathVariable id: UUID,
    ) = procedureService.restoreProcedure(id)

    @GetMapping("catalog")
    fun getProcedureCatalog(
        @RequestParam(required = true)
        specializationId: UUID,
    ) = procedureService.getProcedureCatalog(specializationId)

}
