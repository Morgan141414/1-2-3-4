package kz.saphena.api.service

import com.lowagie.text.pdf.BaseFont
import jakarta.persistence.EntityNotFoundException
import kz.saphena.api.model.appointment.Appointment
import kz.saphena.api.model.patient.Patient
import kz.saphena.api.model.protocol_data.ProtocolFieldData
import kz.saphena.api.model.protocol.ProtocolFieldType
import kz.saphena.api.model.protocol.ProtocolTargetType
import kz.saphena.api.model.protocol_data.ProtocolSectionData
import kz.saphena.api.repository.AssistantRepository
import kz.saphena.api.repository.PatientRepository
import kz.saphena.api.repository.procedure.ProcedureRepository
import kz.saphena.api.repository.appointment.AppointmentRepository
import kz.saphena.api.repository.doctor.DoctorRepository
import kz.saphena.api.repository.organization.OrganizationDocumentRepository
import kz.saphena.api.repository.organization.OrganizationLogoRepository
import kz.saphena.api.repository.organization.OrganizationRepository
import kz.saphena.api.repository.protocol_data.ProtocolDataRepository
import kz.saphena.api.repository.protocol.ProtocolRepository
import kz.saphena.api.repository.spec_doc.SpecializationDocumentRepository
import kz.saphena.api.repository.specialization.SpecializationRepository
import kz.saphena.api.utils.formatToDayMonthYear
import kz.saphena.api.utils.getFullName
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.thymeleaf.TemplateEngine
import org.thymeleaf.context.Context
import org.xhtmlrenderer.pdf.ITextRenderer
import java.io.ByteArrayOutputStream
import java.io.File
import java.time.LocalDate
import java.time.format.DateTimeParseException
import java.util.*

@Service
class PdfService(
    private val templateEngine: TemplateEngine,
    private val protocolDataRepository: ProtocolDataRepository,
    private val protocolRepository: ProtocolRepository,
    private val appointmentRepository: AppointmentRepository,
    private val organizationRepository: OrganizationRepository,
    private val doctorRepository: DoctorRepository,
    private val assistantRepository: AssistantRepository,
    private val patientRepository: PatientRepository,
    private val procedureRepository: ProcedureRepository,
    private val specializationDocumentRepository: SpecializationDocumentRepository,
    private val organizationDocumentRepository: OrganizationDocumentRepository,
    private val organizationLogoRepository: OrganizationLogoRepository,
    private val specializationRepository: SpecializationRepository,
) {

    fun downloadPdfDocument(
        targetType: ProtocolTargetType,
        protocolDataId: UUID,
        lang: String,
    ): ByteArray {
        val protocolData = protocolDataRepository.findByIdOrNull(protocolDataId)
            ?: throw EntityNotFoundException("Protocol data not found!")
        val protocol = protocolRepository.findByIdOrNull(protocolData.protocolId)
            ?: throw EntityNotFoundException("Protocol not found!")

        val localizedName = when (targetType) {
            ProtocolTargetType.PROCEDURE -> procedureRepository.findByIdOrNull(protocol.targetId)
                ?.getLocalizedName(lang)
                ?: throw EntityNotFoundException("Procedure not found!")
            ProtocolTargetType.SPEC_DOC -> specializationDocumentRepository.findByIdOrNull(protocol.targetId)
                ?.getLocalizedName(lang)
                ?: throw EntityNotFoundException("Specialization Document not found!")
            ProtocolTargetType.ORG_DOC -> organizationDocumentRepository.findByIdOrNull(protocol.targetId)
                ?.getLocalizedName(lang)
                ?: throw EntityNotFoundException("Organization document not found!")
        }

        val context = Context()

        if (targetType == ProtocolTargetType.ORG_DOC) {
            val patient = patientRepository.findByIdOrNull(protocolData.patientId)
                ?: throw EntityNotFoundException("Patient not found!")
            val organizationDocument = organizationDocumentRepository.findByIdOrNull(protocol.targetId)
                ?: throw EntityNotFoundException("Organization document not found!")

            setHeaderContext(
                context,
                organizationDocument.organizationId,
                protocolData.createdAt?.formatToDayMonthYear() ?: "",
                localizedName
            )

            setPatientInfoContext(
                context,
                patient
            )

            setSectionsContext(
                context,
                lang,
                protocolData.data,
                protocol.templateFileName
            )
        } else {
            val appointment = appointmentRepository.findByIdOrNull(protocolData.appointmentId)
                ?: throw EntityNotFoundException("Appointment not found!")
            val specName = specializationRepository.findByIdOrNull(appointment.specializationId)
                ?.name
                ?: throw EntityNotFoundException("Specialization not found!")

            setHeaderContext(
                context,
                appointment.organizationId,
                appointment.datetime.formatToDayMonthYear(),
                localizedName
            )

            setFooterContext(
                context = context,
                appointment = appointment,
                assistantId = protocolData.doctorAssistantId,
                specName = specName
            )

            setPatientInfoContext(
                context,
                appointment.patient!!
            )

            setSectionsContext(
                context,
                lang,
                protocolData.data,
                protocol.templateFileName
            )
        }

        val templateName = protocol.templateFileName.takeUnless { it.isNullOrBlank() } ?: "pdf-template.html"

        return generatePdf(context, templateName, lang)
    }

    private fun setHeaderContext(context: Context,
                                 organizationId: UUID,
                                 protocolDate: String,
                                 protocolName: String) {
        val organization = organizationRepository.findByIdOrNull(organizationId)
            ?: throw EntityNotFoundException("Organization not found!")

        context.setVariable("clinicName", organization.clinicName)
        context.setVariable("organizationName", organization.organizationName)
        context.setVariable("organizationPhone", organization.phone)
        context.setVariable("address", organization.address)
        context.setVariable("protocolName", protocolName)
        context.setVariable("protocolDate", protocolDate)

        val logo = organizationLogoRepository.findByOrganizationId(organizationId)
        if (logo != null) {
            val encoded = Base64.getEncoder().encodeToString(logo.fileData)
            context.setVariable("organizationLogo", "data:${logo.contentType};base64,$encoded")
        }
    }

    private fun setPatientInfoContext(context: Context,
                                      patient: Patient
    ) {
        val patientDocument = patient.getActiveDocument()

        context.setVariable("patientFullname", getFullName(patient.firstName, patient.lastName, patient.middleName))
        context.setVariable("patientIin", patient.iin)
        context.setVariable("patientDocType", patientDocument?.type)
        context.setVariable("patientDocNumber", patientDocument?.documentNumber)
        context.setVariable("patientPhone", patient.phone)
        context.setVariable("patientBirthDate", patient.birthdate.formatToDayMonthYear())
        context.setVariable("patientGender", patient.gender.toString())
        context.setVariable("patientAddress", patient.address)
        context.setVariable("patientShortname", "" +
                "${patient.lastName} " +
                "${patient.firstName.first()}. " +
                "${patient.middleName.takeUnless { it.isNullOrBlank() }?.first()?.plus(".") ?: ' '}")
    }

    private fun setSectionsContext(
        context: Context,
        lang: String,
        data: List<ProtocolSectionData>,
        templateFileName: String?
    ) {
        if (templateFileName.isNullOrBlank()) {
            val sections = data.map {
                mapOf(
                    "title" to it.getLocalizedTitle(lang),
                    "fields" to it.fields
                        .filter { f -> f.type !== ProtocolFieldType.PROCEDURE_LIST }
                        .map { f ->
                            when (f.type) {
                                ProtocolFieldType.TABLE -> mapOf(
                                    "title" to f.getLocalizedTitle(lang),
                                    "type" to "TABLE",
                                    "columns" to f.tableColumns,
                                    "rows" to f.tableRows,
                                    "data" to f.tableData
                                )
                                else -> mapOf(
                                    "title" to f.getLocalizedTitle(lang),
                                    "type" to f.type.toString(),
                                    "value" to parseFieldValue(f, lang)
                                )
                            }
                        }
                )
            }
            context.setVariable("sections", sections)
        } else {
            for (section in data) {
                for (field in section.fields) {
                    if (field.type == ProtocolFieldType.PROCEDURE_LIST && !field.providedProcedures.isNullOrEmpty()) {
                        val providedProcedures = field.providedProcedures.map {
                            mapOf(
                                "name" to it.name,
                                "cost" to it.cost,
                                "number" to it.number,
                                "totalCost" to it.totalCost
                            )
                        }
                        context.setVariable("provided_procedures", providedProcedures)

                        val serviceTotalCost = field.providedProcedures.sumOf {
                            it.totalCost.toInt()
                        }
                        context.setVariable("service_totalcost", serviceTotalCost)
                    } else {
                        context.setVariable(field.key, parseFieldValue(field, lang))
                    }
                }
            }
        }
    }

    private fun parseFieldValue(field: ProtocolFieldData, lang: String): String? {
        return when (field.type) {
            ProtocolFieldType.ASSISTANT_SELECT -> {
                field.assistantIds
                    ?.joinToString(separator = "\n\n") { ai ->
                        val assistant = assistantRepository.findByIdOrNull(ai) ?: throw EntityNotFoundException("Assistant not found!")
                        getFullName(assistant.firstName, assistant.lastName, assistant.middleName)
                    }
            }
            ProtocolFieldType.DOCTOR_SELECT -> {
                field.doctorIds
                    ?.joinToString(separator = "\n\n") { ai ->
                        val doctor = doctorRepository.findByIdOrNull(ai) ?: throw EntityNotFoundException("Doctor not found!")
                        getFullName(doctor.firstName, doctor.lastName, doctor.middleName)
                    }
            }
            ProtocolFieldType.RANGE -> {
                val labels = mapOf(
                    "ru" to mapOf("from" to "от", "to" to "до"),
                    "kk" to mapOf("from" to "бастап", "to" to "дейін"),
                    "en" to mapOf("from" to "from", "to" to "to")
                )

                val from = field.from
                val to = field.to
                val unit = field.unit.orEmpty()
                val l = labels[lang] ?: labels["ru"]!!

                return when {
                    from != null && to != null -> "${l["from"]} $from ${l["to"]} $to $unit"
                    from != null -> "${l["from"]} $from $unit"
                    to != null -> "${l["to"]} $to $unit"
                    else -> ""
                }
            }
            else -> {
                try {
                    field.value?.trim()?.let { LocalDate.parse(it).formatToDayMonthYear() }
                } catch (e: DateTimeParseException) {
                    field.value
                }
            }
        }

    }

    private fun setFooterContext(context: Context,
                                 appointment: Appointment,
                                 assistantId: UUID?,
                                 specName: String? = "") {
        context.setVariable("specName", specName)

        context.setVariable("doctorShortname", "" +
                "${appointment.doctor.lastName} " +
                "${appointment.doctor.firstName.first()}. " +
                "${appointment.doctor.middleName.takeUnless { it.isNullOrBlank() }?.first()?.plus(".") ?: ' '}")

        if (assistantId != null) {
            val assistant = assistantRepository.findByIdOrNull(assistantId)
                ?: throw EntityNotFoundException("Assistant not found!")
            context.setVariable("assistantShortname", "" +
                    "${assistant.lastName} " +
                    "${assistant.firstName.first()}. " +
                    "${assistant.middleName.takeUnless { it.isNullOrBlank() }?.first()?.plus(".") ?: ' '}")
        }
    }

    private fun generatePdf(context: Context, template: String, lang: String): ByteArray {
        context.setVariable("protocolLang", lang)

        val outputStream = ByteArrayOutputStream()
        val renderer = ITextRenderer()

        try {
            val fontDir = File("static/fonts")
            val boldFontPath = extractResourceOnce("static/fonts/Roboto-Bold.ttf", fontDir)
            val regularFontPath = extractResourceOnce("static/fonts/Roboto-Regular.ttf", fontDir)
            renderer.fontResolver.addFont(boldFontPath.absolutePath, BaseFont.IDENTITY_H, BaseFont.EMBEDDED)
            renderer.fontResolver.addFont(regularFontPath.absolutePath, BaseFont.IDENTITY_H, BaseFont.EMBEDDED)

            val htmlContent = templateEngine.process(template, context)

            renderer.setDocumentFromString(htmlContent)
            renderer.layout()
            renderer.createPDF(outputStream)
        } finally {
            renderer.sharedContext.reset()
        }

        return outputStream.toByteArray()
    }

    private fun extractResourceOnce(resourcePath: String, outputDir: File): File {
        outputDir.mkdirs()
        val fileName = resourcePath.substringAfterLast("/")
        val outputFile = File(outputDir, fileName)

        if (!outputFile.exists()) {
            javaClass.classLoader.getResourceAsStream(resourcePath)?.use { input ->
                outputFile.outputStream().use { output -> input.copyTo(output) }
            } ?: throw IllegalArgumentException("Resource not found: $resourcePath")
        }

        return outputFile
    }

}