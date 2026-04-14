package kz.saphena.api.configuration.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.util.*

@Component
class OrganizationContextFilter : OncePerRequestFilter() {

    override fun doFilterInternal(request: HttpServletRequest,
                                  response: HttpServletResponse,
                                  filterChain: FilterChain) {
        val orgId = request.getHeader("X-Organization-Id")

        if (!orgId.isNullOrBlank()) {
            OrganizationContext.setCurrentOrganizationId(
                UUID.fromString(orgId)
            )
        }

        try {
            filterChain.doFilter(request, response)
        } finally {
            OrganizationContext.clearCurrentOrganizationId()
        }
    }
}