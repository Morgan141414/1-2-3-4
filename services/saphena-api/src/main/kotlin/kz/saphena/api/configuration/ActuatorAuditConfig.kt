package kz.saphena.api.configuration

import kz.saphena.api.repository.audit.AuditEventEntityRepository
import org.springframework.boot.actuate.audit.AuditEventRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class ActuatorAuditConfig {

    @Bean
    fun auditEventRepository(
        repo: AuditEventEntityRepository,
    ): AuditEventRepository = PersistentAuditEventRepository(repo)
}
