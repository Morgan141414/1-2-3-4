package kz.saphena.api.repository.accounting

import kz.saphena.api.model.accounting.Vendor
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface VendorRepository : JpaRepository<Vendor, UUID> {

    @Query(value = "" +
            "SELECT v " +
            "FROM Vendor v " +
            "WHERE v.deleted = false " +
            "AND v.organizationId = :organizationId " +
            "AND (:search IS NULL OR " +
            "v.bin ILIKE %:search% OR " +
            "v.name ILIKE %:search%)")
    fun findAllByOrganizationId(pageable: Pageable,
                                organizationId: UUID,
                                search: String): Page<Vendor>

    fun getVendorByOrganizationIdAndBin(organizationId: UUID,
                                        bin: String): Vendor?
}