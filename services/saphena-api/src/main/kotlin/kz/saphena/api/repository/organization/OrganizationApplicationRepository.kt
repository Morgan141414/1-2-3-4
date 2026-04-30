package kz.saphena.api.repository.organization

import kz.saphena.api.model.organization.OrganizationApplication
import org.javers.spring.annotation.JaversSpringDataAuditable
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
@JaversSpringDataAuditable
interface OrganizationApplicationRepository : JpaRepository<OrganizationApplication, UUID> {

    @Query(
        """
        select oa
        from OrganizationApplication oa
        where oa.deleted = false
        """
    )
    fun findApplications(pageable: Pageable): Page<OrganizationApplication>

    @Query(
        """
        select case when count(oa) > 0 then true else false end
        from OrganizationApplication oa
        where oa.deleted = false
          and oa.status = kz.saphena.api.model.organization.OrganizationApplicationStatus.PENDING
          and (
            lower(oa.clinicName) = lower(:clinicName)
            or oa.bin = :bin
          )
        """
    )
    fun existsPendingDuplicate(
        @Param("clinicName") clinicName: String,
        @Param("bin") bin: String
    ): Boolean
}
