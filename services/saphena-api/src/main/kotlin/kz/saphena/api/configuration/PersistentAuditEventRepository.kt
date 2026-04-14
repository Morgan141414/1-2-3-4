package kz.saphena.api.configuration

import kz.saphena.api.model.audit.AuditEventEntity
import kz.saphena.api.repository.audit.AuditEventEntityRepository
import org.springframework.boot.actuate.audit.AuditEvent
import org.springframework.boot.actuate.audit.AuditEventRepository
import java.time.Instant

class PersistentAuditEventRepository(
    private val repo: AuditEventEntityRepository,
) : AuditEventRepository {

    override fun add(event: AuditEvent) {
        val entity = AuditEventEntity(
            principal = event.principal ?: "anonymous",
            eventType = event.type,
            eventTimestamp = event.timestamp ?: Instant.now(),
            data = event.data,
        )
        repo.save(entity)
    }

    override fun find(principal: String?, after: Instant?, type: String?): MutableList<AuditEvent> {
        val list = repo.findAllFiltered(principal, after, type)
        return list.map { toAuditEvent(it) }.toMutableList()
    }

    private fun toAuditEvent(entity: AuditEventEntity): AuditEvent {
        val dataMap: Map<String, Any?>? = entity.data
        return AuditEvent(entity.eventTimestamp, entity.principal, entity.eventType, dataMap)
    }
}
