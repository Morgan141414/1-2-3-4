package kz.saphena.api.configuration.security

import org.springframework.data.domain.AuditorAware
import org.springframework.security.authentication.AnonymousAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import java.util.*

class SpringSecurityAuditorAware : AuditorAware<String> {

    override fun getCurrentAuditor(): Optional<String> {
        val auth = SecurityContextHolder.getContext().authentication

        return if (auth == null || !auth.isAuthenticated || auth is AnonymousAuthenticationToken) {
            return Optional.of("System")
        } else {
            Optional.of(auth.name)
        }
    }
}