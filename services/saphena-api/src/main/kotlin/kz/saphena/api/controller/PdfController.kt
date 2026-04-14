package kz.saphena.api.controller

import kz.saphena.api.model.protocol.ProtocolTargetType
import kz.saphena.api.service.PdfService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/pdf")
class PdfController(
    private val pdfService: PdfService
) {

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_DOCTOR', 'ROLE_PATIENT')")
    fun downloadPdfDocument(
        @RequestParam(required = true)
        targetType: ProtocolTargetType,
        @RequestParam(required = true)
        protocolDataId: UUID,
        @RequestParam(defaultValue = "ru")
        lang: String
    ) = pdfService.downloadPdfDocument(
        targetType = targetType,
        protocolDataId = protocolDataId,
        lang = lang,
    )

}