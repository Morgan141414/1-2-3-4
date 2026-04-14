package kz.saphena.api.model.organization

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Lob
import org.hibernate.annotations.JdbcTypeCode
import java.util.UUID

@Entity
class OrganizationLogo(
    @Id
    var organizationId: UUID,
    @Lob
    @JdbcTypeCode(java.sql.Types.BINARY)
    var fileData: ByteArray,
    var contentType: String,
    var fileName: String?,
)
