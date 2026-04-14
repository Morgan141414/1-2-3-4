package kz.saphena.api.service

import jakarta.persistence.EntityNotFoundException
import java.util.UUID
import kz.saphena.api.dto.protocol.CreateProtocolDataRequest
import kz.saphena.api.dto.protocol.ProtocolDataResponse
import kz.saphena.api.dto.protocol.UpdateProtocolDataRequest
import kz.saphena.api.dto.protocol.toProtocolDataResponse
import kz.saphena.api.dto.spec_doc.SpecializationDocumentResponse
import kz.saphena.api.dto.spec_doc.toSpecDocResponse
import kz.saphena.api.model.appointment.AppointmentStatusType
import kz.saphena.api.model.protocol.ProtocolTargetType
import kz.saphena.api.model.protocol_data.ProtocolData
import kz.saphena.api.repository.appointment.AppointmentProcedureRepository
import kz.saphena.api.repository.appointment.AppointmentRepository
import kz.saphena.api.repository.protocol_data.ProtocolDataRepository
import kz.saphena.api.repository.protocol.ProtocolRepository
import kz.saphena.api.repository.spec_doc.SpecializationDocumentRepository
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ProtocolDataService(
    private val appointmentRepository: AppointmentRepository,
    private val appointmentProcedureRepository: AppointmentProcedureRepository,
    private val appointmentProcedureService: AppointmentProcedureService,
    private val protocolRepository: ProtocolRepository,
    private val protocolDataRepository: ProtocolDataRepository,
    private val specializationDocumentRepository: SpecializationDocumentRepository,
    private val pdfService: PdfService,
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun getProtocolData(
        targetType: ProtocolTargetType,
        targetId: UUID,
        appointmentId: UUID,
    ): ProtocolDataResponse? {
        return protocolDataRepository.findByProtocolData(
            targetType = targetType,
            targetId = targetId,
            appointmentId = appointmentId,
        )?.toProtocolDataResponse()
    }

    @Transactional
    fun saveProcedureProtocolData(request: CreateProtocolDataRequest): ProtocolDataResponse {
        log.info(
            "Saving ProcedureProtocolData: appointmentId={}, protocolId={}, patientId={}, doctorAssistantId={}",
            request.appointmentId,
            request.protocolId,
            request.patientId,
            request.doctorAssistantId
        )
        val protocolData = protocolDataRepository.save(
            ProtocolData(
                type = ProtocolTargetType.PROCEDURE,
                appointmentId = request.appointmentId,
                protocolId = request.protocolId,
                patientId = request.patientId,
                data = request.data,
                doctorAssistantId = request.doctorAssistantId
            )
        )
        log.debug("Saved ProcedureProtocolData with id={}", protocolData.id)

        val protocol = protocolRepository.findByIdOrNull(request.protocolId)
            ?: throw EntityNotFoundException("Protocol not found")

        val appointmentProcedure = appointmentProcedureRepository
            .findByAppointmentIdAndProcedureId(
                appointmentId = request.appointmentId!!,
                procedureId = protocol.targetId
            )

        appointmentProcedureService.closeAppointmentProcedure(appointmentProcedure.getIdSafely())
        log.debug(
            "Closed AppointmentProcedure id={} for appointmentId={} & procedureId={}",
            appointmentProcedure.getIdSafely(),
            request.appointmentId,
            protocol.targetId
        )

        val appointment = appointmentRepository.findByIdOrNull(request.appointmentId)
            ?: throw EntityNotFoundException("Appointment not found")

        appointmentRepository.save(
            appointment.also {
                it.status = AppointmentStatusType.IN_PROGRESS
            }
        )
        log.info("Updated appointment status to IN_PROGRESS: appointmentId={}", request.appointmentId)
        return protocolData.toProtocolDataResponse()
    }

    fun saveSpecializationDocumentProtocolData(request: CreateProtocolDataRequest) {
        log.info(
            "Saving SpecializationDocumentProtocolData: appointmentId={}, protocolId={}, patientId={}, doctorAssistantId={}",
            request.appointmentId,
            request.protocolId,
            request.patientId,
            request.doctorAssistantId
        )
        val saved = protocolDataRepository.save(
            ProtocolData(
                type = ProtocolTargetType.SPEC_DOC,
                appointmentId = request.appointmentId,
                protocolId = request.protocolId,
                patientId = request.patientId,
                data = request.data,
                doctorAssistantId = request.doctorAssistantId
            )
        )
        log.debug("Saved SpecializationDocumentProtocolData with id={}", saved.id)
    }

    fun saveOrganizationDocumentProtocolData(
        request: CreateProtocolDataRequest,
        lang: String
    ): ByteArray {
        log.info(
            "Saving OrganizationDocumentProtocolData: protocolId={}, patientId={}",
            request.protocolId,
            request.patientId
        )
        val protocolData = protocolDataRepository.save(
            ProtocolData(
                type = ProtocolTargetType.ORG_DOC,
                appointmentId = null,
                protocolId = request.protocolId,
                patientId = request.patientId,
                data = request.data,
                doctorAssistantId = null,
            )
        )
        log.debug("Saved OrganizationDocumentProtocolData with id={}", protocolData.id)

        val bytes = pdfService.downloadPdfDocument(
            targetType = ProtocolTargetType.ORG_DOC,
            protocolDataId = protocolData.getIdSafely(),
            lang = lang,
        )
        log.info(
            "Generated PDF for OrganizationDocumentProtocolData: id={}, lang={}, size={} bytes",
            protocolData.id,
            lang,
            bytes.size
        )
        return bytes
    }

    fun updateProtocolData(
        id: UUID,
        request: UpdateProtocolDataRequest
    ): ProtocolDataResponse {
        log.info("Updating ProtocolData: id={}, doctorAssistantId={}", id, request.doctorAssistantId)
        val procedureProtocolData = protocolDataRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Protocol Data not found")

        val updatedProcedureProtocolData = protocolDataRepository.save(
            procedureProtocolData.also {
                it.data = request.data
                it.doctorAssistantId = request.doctorAssistantId
            }
        )
        log.debug("Updated ProtocolData saved: id={}", procedureProtocolData.id)
        return updatedProcedureProtocolData.toProtocolDataResponse()
    }

    fun getAppointmentSpecializationDocuments(appointmentId: UUID): List<SpecializationDocumentResponse> {
        val protocols = protocolDataRepository.findProtocolsByAppointmentIdAndTargetType(
            appointmentId = appointmentId,
            targetType = ProtocolTargetType.SPEC_DOC
        )

        return protocols.map {
            val specializationDocument = specializationDocumentRepository
                .findByIdOrNull(it.targetId)
                ?: throw EntityNotFoundException("SpecializationDocument not found")

            specializationDocument.toSpecDocResponse()
        }
    }

}
