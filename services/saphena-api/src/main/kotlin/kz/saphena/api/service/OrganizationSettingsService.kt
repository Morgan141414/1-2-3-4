package kz.saphena.api.service

import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.model.organization.OrganizationLogo
import kz.saphena.api.repository.organization.OrganizationLogoRepository
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
class OrganizationSettingsService(
    private val organizationLogoRepository: OrganizationLogoRepository
) {

    fun uploadLogo(file: MultipartFile): ByteArray {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        val logo = organizationLogoRepository.save(
            OrganizationLogo(
                organizationId = myOrgId,
                fileData = file.bytes,
                contentType = file.contentType ?: "application/octet-stream",
                fileName = file.originalFilename
            )
        )

        return logo.fileData
    }

    fun getLogo(): ByteArray? {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        val logo = organizationLogoRepository.findByOrganizationId(myOrgId)

        return logo?.fileData
    }

    fun deleteLogo() {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        organizationLogoRepository.deleteById(myOrgId)
    }

}