package kz.saphena.api.repository.protocol

import kz.saphena.api.model.protocol.Protocol
import kz.saphena.api.model.protocol.ProtocolTargetType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface ProtocolRepository : JpaRepository<Protocol, UUID> {

    @Query("""
        select p
        from Protocol p
        where p.isActive = true 
            and p.targetType = :targetType
            and p.targetId = :targetId
            and (
                p.organizationId = :organizationId
                or p.organizationId is null
            )
        order by 
            case when p.organizationId = :organizationId then 0 else 1 end
    """)
    fun findActiveProtocol(
        targetType: ProtocolTargetType,
        targetId: UUID,
        organizationId: UUID?
    ): List<Protocol>

    @Modifying
    @Query("""
        update Protocol p
        set p.isActive = false
        where p.targetType = :targetType
            and p.targetId = :targetId
            and p.organizationId is not distinct from :organizationId
            and p.isActive = true
    """)
    fun deactivateOldProtocols(
        targetType:
        ProtocolTargetType,
        targetId: UUID,
        organizationId: UUID?
    )

    @Query("""
        select p.targetId
        from Protocol p
        where p.targetType = :targetType
          and p.organizationId = :organizationId
          and p.isActive = true
    """)
    fun findAllModifiedTargetIds(
        targetType: ProtocolTargetType,
        organizationId: UUID,
    ): Set<UUID>

    @Modifying
    @Query("""
        update Protocol p
        set p.isActive = false
        where p.targetType = :targetType
          and p.targetId = :targetId
          and p.organizationId = :organizationId
          and p.isActive = true
    """)
    fun deactivateActiveOrgProtocol(
        targetType: ProtocolTargetType,
        targetId: UUID,
        organizationId: UUID,
    ): Int

}
