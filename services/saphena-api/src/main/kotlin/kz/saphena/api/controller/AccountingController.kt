package kz.saphena.api.controller

import kz.saphena.api.dto.accounting.CreateExpenseRequest
import kz.saphena.api.dto.accounting.CreateExpenseTypeRequest
import kz.saphena.api.dto.accounting.CreateVendorRequest
import kz.saphena.api.model.accounting.ExpenseFilterParams
import kz.saphena.api.service.AccountingService
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.web.PageableDefault
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/accounting")
class AccountingController(
    private val accountingService: AccountingService
) {

    @GetMapping("/expenses")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ACCOUNTANT')")
    fun getExpenses(
        @PageableDefault(sort = ["datetime"], direction = Sort.Direction.DESC)
        pageable: Pageable,
        filter: ExpenseFilterParams
    ) = accountingService.getExpenses(pageable, filter)

    @GetMapping("/expenses/{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ACCOUNTANT')")
    fun getExpense(
        @PathVariable
        id: UUID
    ) = accountingService.getExpense(id)

    @PostMapping("/expenses")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ACCOUNTANT')")
    fun createExpense(
        @RequestBody request: CreateExpenseRequest
    ) = accountingService.createExpense(request)

    @GetMapping("/expense-types")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ACCOUNTANT')")
    fun getExpenseTypes() = accountingService.getExpenseTypes()

    @PostMapping("/expense-types")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ACCOUNTANT')")
    fun createExpenseType(
        @RequestBody request: CreateExpenseTypeRequest
    ) = accountingService.createExpenseType(request)

    @PutMapping("/expense-types/{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO')")
    fun updateExpenseType(
        @PathVariable id: UUID,
        @RequestBody request: CreateExpenseTypeRequest
    ) = accountingService.updateExpenseType(id, request)

    @DeleteMapping("/expense-types/{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO')")
    fun deleteExpenseType(
        @PathVariable id: UUID
    ) = accountingService.deleteExpenseType(id)

    @GetMapping("/vendors")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ACCOUNTANT')")
    fun getVendors(
        @PageableDefault(sort = ["name"], direction = Sort.Direction.DESC)
        pageable: Pageable,
        @RequestParam
        search: String
    ) = accountingService.getVendors(pageable, search)

    @GetMapping("/vendors/{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO')")
    fun getVendorById(
        @PathVariable id: UUID
    ) = accountingService.getVendorById(id)

    @GetMapping("/vendors/bin/{bin}")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ACCOUNTANT')")
    fun getVendorByBin(
        @PathVariable bin: String
    ) = accountingService.getVendorByBin(bin)

    @PostMapping("/vendors")
    @PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ACCOUNTANT')")
    fun createVendor(
        @RequestBody request: CreateVendorRequest
    ) = accountingService.createVendor(request)

    @PutMapping("/vendors/{id}")
    @PreAuthorize("hasAnyRole('ROLE_CEO')")
    fun updateVendor(
        @PathVariable id: UUID,
        @RequestBody request: CreateVendorRequest
    ) = accountingService.updateVendor(id, request)

}