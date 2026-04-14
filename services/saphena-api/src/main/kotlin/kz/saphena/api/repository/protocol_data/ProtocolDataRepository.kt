package kz.saphena.api.repository.protocol_data

import kz.saphena.api.model.protocol.Protocol
import kz.saphena.api.model.protocol.ProtocolTargetType
import kz.saphena.api.model.protocol_data.ProtocolData
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface ProtocolDataRepository : JpaRepository<ProtocolData, UUID> {

    @Query("""
        select pd
        from ProtocolData pd
        join Protocol p on p.id = pd.protocolId
        where pd.appointmentId = :appointmentId
            and p.targetType = :targetType
            and p.targetId = :targetId
    """)
    fun findByProtocolData(
        targetType: ProtocolTargetType,
        targetId: UUID,
        appointmentId: UUID,
    ): ProtocolData?

    @Query(value = "" +
            "SELECT sdpd " +
            "FROM ProtocolData sdpd " +
            "JOIN Protocol p ON p.id = sdpd.protocolId " +
            "WHERE sdpd.appointmentId = :appointmentId " +
            "AND p.targetId = :specializationDocumentId")
    fun findByAppointmentIdAndSpecializationDocumentId(appointmentId: UUID,
                                                       specializationDocumentId: UUID): ProtocolData?
//
    @Query("""
        select p
        from ProtocolData pd
        join Protocol p on p.id = pd.protocolId
        where pd.appointmentId = :appointmentId
            and p.targetType = :targetType
    """)
    fun findProtocolsByAppointmentIdAndTargetType(
        appointmentId: UUID,
        targetType: ProtocolTargetType,
    ): List<Protocol>
}
