package kz.saphena.api.service

import jakarta.persistence.EntityExistsException
import jakarta.persistence.EntityManager
import jakarta.persistence.EntityNotFoundException
import jakarta.persistence.criteria.CriteriaBuilder
import jakarta.persistence.criteria.JoinType
import jakarta.persistence.criteria.Predicate
import jakarta.persistence.criteria.Root
import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.dto.PageResponse
import kz.saphena.api.dto.accounting.*
import kz.saphena.api.model.accounting.Expense
import kz.saphena.api.model.accounting.ExpenseFilterParams
import kz.saphena.api.model.accounting.ExpenseType
import kz.saphena.api.model.accounting.Vendor
import kz.saphena.api.repository.accounting.ExpenseRepository
import kz.saphena.api.repository.accounting.ExpenseTypeRepository
import kz.saphena.api.repository.accounting.VendorRepository
import kz.saphena.api.utils.nullIfBlankTrimmed
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.util.*

@Service
class AccountingService(
    private val expenseRepository: ExpenseRepository,
    private val expenseTypeRepository: ExpenseTypeRepository,
    private val vendorRepository: VendorRepository,
    private val entityManager: EntityManager
) {
    fun getExpenses(pageable: Pageable,
                    filter: ExpenseFilterParams): PageResponse<ExpenseResponse> {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        val expenses =  findExpensesByCriteria(
            myOrgId,
            pageable,
            filter.typeId,
            filter.from,
            filter.to,
            filter.bin
        )

        return expenses
            .map { it.toResponse() }
            .let {
                PageResponse(
                    content = it.content,
                    totalPages = it.totalPages,
                    number = it.number,
                    last = it.isLast
                )
            }
    }

    fun getExpense(id: UUID): ExpenseResponse {
        return expenseRepository.findByIdOrNull(id)?.toResponse()
            ?: throw EntityNotFoundException("Expense not found!")
    }

    @Transactional
    fun createExpense(request: CreateExpenseRequest) {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        val vendor = if (request.vendorId != null) {
            vendorRepository.getReferenceById(request.vendorId)
        } else if (!request.vendorBin.isNullOrBlank()) {
            vendorRepository.save(
                Vendor(
                    organizationId = myOrgId,
                    bin = request.vendorBin,
                    name = request.vendorName.nullIfBlankTrimmed(),
                    contactPersonName = request.contactPersonName.nullIfBlankTrimmed(),
                    contactPersonPhone = request.contactPersonPhone.nullIfBlankTrimmed(),
                )
            )
        } else null

        val expenseType = expenseTypeRepository.getReferenceById(request.typeId)

        expenseRepository.save(
            Expense(
                organizationId = myOrgId,
                type = expenseType,
                vendor = vendor,
                date = request.date.atStartOfDay(),
                expenseList = request.expenseList,
                totalCost = request.totalCost,
                comment = request.comment.nullIfBlankTrimmed(),
                contactPersonName = request.contactPersonName.nullIfBlankTrimmed(),
                contactPersonPhone = request.contactPersonPhone.nullIfBlankTrimmed(),
            )
        )
    }

    fun getExpenseTypes(): List<ExpenseTypeResponse> {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        return expenseTypeRepository.findAllByOrganizationId(myOrgId)
            .map { it.toResponse() }
    }

    fun createExpenseType(request: CreateExpenseTypeRequest) {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        if (expenseTypeRepository.existsByOrganizationIdAndName(myOrgId, request.name.trim())) {
            throw EntityExistsException("Expense Type already exists")
        }

        expenseTypeRepository.save(
            ExpenseType(
                organizationId = myOrgId,
                name = request.name.trim()
            )
        )
    }

    fun updateExpenseType(id: UUID,
                          request: CreateExpenseTypeRequest) {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        if (expenseTypeRepository.existsByOrganizationIdAndName(myOrgId, request.name.trim())) {
            throw EntityExistsException("Expense Type already exists")
        }

        val expenseType = expenseTypeRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Expense Type not found")

        expenseTypeRepository.save(
            expenseType.also {
                it.name = request.name.trim()
            }
        )
    }

    fun deleteExpenseType(id: UUID) {
        val expenseType = expenseTypeRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Expense Type not found")

        expenseTypeRepository.save(
            expenseType.also { it.markDeleted() }
        )
    }

    fun getVendors(pageable: Pageable,
                   search: String): PageResponse<VendorResponse> {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        return vendorRepository.findAllByOrganizationId(pageable, myOrgId, search)
            .map { it.toResponse() }
            .let {
                PageResponse(
                    content = it.content,
                    totalPages = it.totalPages,
                    number = it.number,
                    last = it.isLast
                )
            }
    }

    fun getVendorById(id: UUID): VendorResponse {
        return vendorRepository.findByIdOrNull(id)?.toResponse()
            ?: throw EntityNotFoundException("Vendor not found")
    }

    fun getVendorByBin(bin: String): VendorResponse? {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        return vendorRepository.getVendorByOrganizationIdAndBin(myOrgId, bin)
            ?.toResponse()
    }

    fun createVendor(request: CreateVendorRequest) {
        val myOrgId = OrganizationContext.getCurrentOrganizationId()

        vendorRepository.save(
            Vendor(
                organizationId = myOrgId,
                bin = request.bin,
                name = request.name.nullIfBlankTrimmed(),
                contactPersonName = request.contactPersonName.nullIfBlankTrimmed(),
                contactPersonPhone = request.contactPersonPhone.nullIfBlankTrimmed()
            )
        )
    }

    fun updateVendor(id: UUID,
                     request: CreateVendorRequest) {
        val vendor = vendorRepository.findByIdOrNull(id)
            ?: throw EntityNotFoundException("Vendor not found")

        vendorRepository.save(
            vendor.also { v ->
                v.bin = request.bin
                v.name = request.name
                v.contactPersonName = request.contactPersonName.nullIfBlankTrimmed()
                v.contactPersonPhone = request.contactPersonPhone.nullIfBlankTrimmed()
            }
        )
    }

    private fun findExpensesByCriteria(
        organizationId: UUID,
        pageable: Pageable,
        typeId: UUID?,
        from: LocalDate?,
        to: LocalDate?,
        bin: String?
    ): Page<Expense> {
        val cb = entityManager.criteriaBuilder

        // Main query
        val cq = cb.createQuery(Expense::class.java)
        val root = cq.from(Expense::class.java)
        val predicates = buildPredicates(cb, root, organizationId, typeId, from, to, bin)
        cq.where(*predicates.toTypedArray())
        cq.orderBy(cb.desc(root.get<LocalDate>("date")))
        val query = entityManager.createQuery(cq)
        query.firstResult = pageable.offset.toInt()
        query.maxResults = pageable.pageSize
        val resultList = query.resultList

        // Count query
        val countCq = cb.createQuery(Long::class.java)
        val countRoot = countCq.from(Expense::class.java)
        val countPredicates = buildPredicates(cb, countRoot, organizationId, typeId, from, to, bin)
        countCq.select(cb.count(countRoot))
        countCq.where(*countPredicates.toTypedArray())
        val total = entityManager.createQuery(countCq).singleResult

        return PageImpl(resultList, pageable, total)
    }

    private fun buildPredicates(
        cb: CriteriaBuilder,
        root: Root<Expense>,
        organizationId: UUID,
        typeId: UUID?,
        from: LocalDate?,
        to: LocalDate?,
        bin: String?
    ): List<Predicate> {
        val type = root.join<Expense, ExpenseType>("type")
        val vendor = root.join<Expense, Vendor>("vendor", JoinType.LEFT)
        val predicates = mutableListOf<Predicate>()

        predicates += cb.isFalse(root.get("deleted"))
        predicates += cb.equal(root.get<UUID>("organizationId"), organizationId)

        typeId?.let {
            predicates += cb.equal(type.get<UUID>("id"), typeId)
        }

        from?.let {
            predicates += cb.greaterThanOrEqualTo(root.get("date"), it)
        }

        to?.let {
            predicates += cb.lessThanOrEqualTo(root.get("date"), it)
        }

        bin?.takeIf { it.isNotBlank() }?.let {
            val pattern = "%${it.lowercase()}%"
            predicates += cb.or(
                cb.like(cb.lower(vendor.get("bin")), pattern)
            )
        }

        return predicates
    }

}