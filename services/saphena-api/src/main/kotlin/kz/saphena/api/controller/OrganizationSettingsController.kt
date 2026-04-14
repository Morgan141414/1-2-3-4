package kz.saphena.api.controller

import kz.saphena.api.service.OrganizationSettingsService
import org.springframework.http.MediaType
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/organization-settings")
class OrganizationSettingsController(
    val organizationSettingsService: OrganizationSettingsService
) {

    @PostMapping(
        value = ["logo"],
        produces = [MediaType.APPLICATION_OCTET_STREAM_VALUE]
    )
    @PreAuthorize("hasRole('ROLE_ORGANIZATION_ADMIN')")
    fun uploadLogo(
        @RequestParam(required = true)
        file: MultipartFile
    ) = organizationSettingsService.uploadLogo(file)

    @GetMapping(
        value = ["logo"],
        produces = [MediaType.APPLICATION_OCTET_STREAM_VALUE]
    )
    @PreAuthorize("hasRole('ROLE_ORGANIZATION_ADMIN')")
    fun getLogo() = organizationSettingsService.getLogo()

    @DeleteMapping("logo")
    @PreAuthorize("hasRole('ROLE_ORGANIZATION_ADMIN')")
    fun deleteLogo() = organizationSettingsService.deleteLogo()

}