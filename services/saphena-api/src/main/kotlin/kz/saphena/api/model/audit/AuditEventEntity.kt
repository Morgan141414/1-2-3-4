package kz.saphena.api.model.audit

import io.hypersistence.utils.hibernate.type.json.JsonType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.Type
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "audit_event")
class AuditEventEntity(
    @Id
    @Column(nullable = false)
    var id: UUID = UUID.randomUUID(),

    @Column(nullable = false, length = 100)
    var principal: String,

    @Column(name = "event_type", nullable = false, length = 64)
    var eventType: String,

    @Column(name = "event_timestamp", nullable = false)
    var eventTimestamp: Instant = Instant.now(),

    @Type(JsonType::class)
    @Column(columnDefinition = "jsonb")
    var data: Map<String, Any?>? = null,
)
