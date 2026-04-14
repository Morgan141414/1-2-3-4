package kz.saphena.api.controller

import kz.saphena.api.service.AnalyticsService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/analytics")
class AnalyticsController(
    private val analyticsService: AnalyticsService
) {

    @GetMapping("traffic")
    @PreAuthorize("hasAnyRole('ROLE_CEO')")
    fun getTrafficAnalytics(
        @RequestParam(required = false) year: Int,
        @RequestParam(required = false) month: Int?,
    ) = analyticsService.getTrafficAnalytics(year, month)

    @GetMapping("expense")
    @PreAuthorize("hasAnyRole('ROLE_CEO')")
    fun getExpenseAnalytics(
        @RequestParam(required = false) year: Int,
        @RequestParam(required = false) month: Int?,
    ) = analyticsService.getExpenseAnalytics(year, month)

    @GetMapping("income")
    @PreAuthorize("hasAnyRole('ROLE_CEO')")
    fun getIncomeAnalytics(
        @RequestParam(required = false) year: Int,
        @RequestParam(required = false) month: Int?,
    ) = analyticsService.getIncomeAnalytics(year, month)

}