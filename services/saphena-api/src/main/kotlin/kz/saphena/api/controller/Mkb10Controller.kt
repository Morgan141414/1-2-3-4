package kz.saphena.api.controller

import kz.saphena.api.service.Mkb10Service
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/mkb10")
class Mkb10Controller(
    private val mkb10Service: Mkb10Service
) {
    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_SUPERADMIN', 'ROLE_DOCTOR', 'ROLE_ORGANIZATION_ADMIN')")
    fun getMkb10Dictionary() = mkb10Service.getMkb10Dictionary()

    @PostMapping
    @PreAuthorize("hasRole('ROLE_SUPERADMIN')")
    fun updateMkb10Dictionary(
        @RequestPart(required = true)
        file: MultipartFile
    ) = mkb10Service.updateMkb10Dictionary(file)

}