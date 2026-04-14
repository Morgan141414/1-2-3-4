package kz.saphena.api.repository.organization

import kz.saphena.api.model.organization.Organization
import kz.saphena.api.model.organization.OrganizationUser
import kz.saphena.api.model.user.UserRoleType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface OrganizationUserRepository : JpaRepository<OrganizationUser, UUID> {

    @Query(value = """
        select uo
        from OrganizationUser uo
        where uo.organization.id = :id
            and uo.user.role = :role
            and uo.user.deleted = false
    """)
    fun findOrganizationUsersByOrganizationIdAndRole(id: UUID,
                                                     role: UserRoleType
    ): List<OrganizationUser>

    @Query(value = """
        select uo.organization 
        from OrganizationUser uo 
        where uo.user.id = :id
            and uo.deleted = false
    """)
    fun findOrganizationsByUserId(id: UUID): List<Organization>

    fun findByUserIdAndOrganizationId(userId: UUID,
                                      organizationId: UUID): OrganizationUser?

    fun existsByUserIdAndOrganizationId(userId: UUID,
                                        organizationId: UUID): Boolean

}
