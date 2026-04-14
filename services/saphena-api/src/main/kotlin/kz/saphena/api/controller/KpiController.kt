package kz.saphena.api.controller

import kz.saphena.api.dto.PageResponse
import java.util.UUID
import kz.saphena.api.dto.kpi.KpiEventDto
import kz.saphena.api.dto.kpi.MyKpiDto
import kz.saphena.api.service.KpiAggregationService
import kz.saphena.api.service.KpiService
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.web.PageableDefault
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate

@RestController
@RequestMapping("/api/kpi")
class KpiController(
    private val kpiAggregationService: KpiAggregationService,
    private val kpiService: KpiService,
) {
    private val logger = LoggerFactory.getLogger(KpiController::class.java)

    private fun currentUsername(): String =
        SecurityContextHolder.getContext().authentication?.name ?: "anonymous"

    @GetMapping("/doctors")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ACCOUNTANT')")
    fun doctorKpi(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) from: LocalDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) to: LocalDate,
    ) = run {
        logger.info("User '{}' fetching doctor KPI for from={} to={}", currentUsername(), from, to)
        kpiAggregationService.doctorKpi(from, to)
    }

    @GetMapping("/assistants")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ACCOUNTANT')")
    fun assistantKpi(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) from: LocalDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) to: LocalDate,
    ) = run {
        logger.info("User '{}' fetching assistant KPI for from={} to={}", currentUsername(), from, to)
        kpiAggregationService.assistantKpi(from, to)
    }

    @GetMapping("/operators")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ACCOUNTANT')")
    fun operatorKpi(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) from: LocalDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) to: LocalDate,
    ) = run {
        logger.info("User '{}' fetching operator KPI for from={} to={}", currentUsername(), from, to)
        kpiAggregationService.operatorKpi(from, to)
    }

    @GetMapping("/reception")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ACCOUNTANT')")
    fun receptionKpi(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) from: LocalDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) to: LocalDate,
    ) = run {
        logger.info("User '{}' fetching reception KPI for from={} to={}", currentUsername(), from, to)
        kpiAggregationService.receptionKpi(from, to)
    }

    @GetMapping("/events")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ACCOUNTANT')")
    fun getKpiEvents(
        @RequestParam userId: UUID,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) from: LocalDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) to: LocalDate,
        @PageableDefault(sort = ["occurredAt"], direction = Sort.Direction.DESC) pageable: Pageable,
    ): PageResponse<KpiEventDto> {
        logger.info(
            "User '{}' fetching KPI events for userId={} from={} to={} page={} size={}",
            currentUsername(), userId, from, to, pageable.pageNumber, pageable.pageSize
        )
        return kpiService.getEvents(userId, from, to, pageable)
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ROLE_DOCTOR')")
    fun myKpi(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) from: LocalDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) to: LocalDate,
        @PageableDefault(sort = ["occurredAt"], direction = Sort.Direction.DESC) pageable: Pageable,
    ): MyKpiDto {
        logger.info(
            "User '{}' fetching his KPI for from={} to={} page={} size={}",
            currentUsername(), from, to, pageable.pageNumber, pageable.pageSize
        )
        return kpiService.myKpi(from, to, pageable)
    }
}
