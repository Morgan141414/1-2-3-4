package kz.saphena.api.model.doctor

import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import kz.saphena.api.model.AbstractBaseAuditableEntity
import kz.saphena.api.model.assistant.Assistant
import kz.saphena.api.model.organization.OrganizationUser
import java.util.UUID

@Entity
class DoctorAssistant(
    val doctorId: UUID, // Удалить в будущем, так как маппинг теперь через orgUserId
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assistant_id")
    val assistant: Assistant,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_user_id")
    val orgUser: OrganizationUser
) : AbstractBaseAuditableEntity()
