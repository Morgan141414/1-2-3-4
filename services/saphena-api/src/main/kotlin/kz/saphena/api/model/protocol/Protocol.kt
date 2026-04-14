package kz.saphena.api.model.protocol

import io.hypersistence.utils.hibernate.type.json.JsonType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import kz.saphena.api.model.AbstractBaseAuditableEntity
import org.hibernate.annotations.Type
import java.util.UUID

@Entity
class Protocol(
    @Enumerated(EnumType.STRING)
    val targetType: ProtocolTargetType,
    val targetId: UUID,
    val organizationId: UUID? = null, // null = шаблон
    val isActive: Boolean,
    @Type(JsonType::class)
    @Column(columnDefinition = "jsonb")
    val sections: List<ProtocolSection>,
    val consultationRequired: Boolean?,
    val templateFileName: String?,
) : AbstractBaseAuditableEntity()
