package kz.saphena.api.model.accounting

import io.hypersistence.utils.hibernate.type.json.JsonType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import kz.saphena.api.model.AbstractBaseAuditableEntity
import org.hibernate.annotations.Type
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@Entity
class Expense(
    val organizationId: UUID,
    @ManyToOne
    @JoinColumn(name = "type_id", nullable = false)
    val type: ExpenseType,
    @ManyToOne
    @JoinColumn(name = "vendor_id")
    val vendor: Vendor?,
    val date: LocalDateTime,
    @Type(JsonType::class)
    @Column(columnDefinition = "jsonb")
    val expenseList: List<ExpenseListItem>,
    val totalCost: BigDecimal,
    val comment: String?,
    var contactPersonName: String?,
    var contactPersonPhone: String?
) : AbstractBaseAuditableEntity()