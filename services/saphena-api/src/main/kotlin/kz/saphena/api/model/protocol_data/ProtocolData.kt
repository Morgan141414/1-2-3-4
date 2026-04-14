package kz.saphena.api.model.protocol_data

import io.hypersistence.utils.hibernate.type.json.JsonType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import kz.saphena.api.model.AbstractBaseAuditableEntity
import kz.saphena.api.model.protocol.ProtocolTargetType
import org.hibernate.annotations.Type
import java.util.UUID

@Entity
class ProtocolData(
    @Enumerated(EnumType.STRING)
    val type: ProtocolTargetType,
    val protocolId: UUID,
    val patientId: UUID,
    val appointmentId: UUID?,
    var doctorAssistantId: UUID?,
    @Type(JsonType::class)
    @Column(columnDefinition = "jsonb")
    var data: List<ProtocolSectionData>
) : AbstractBaseAuditableEntity()
