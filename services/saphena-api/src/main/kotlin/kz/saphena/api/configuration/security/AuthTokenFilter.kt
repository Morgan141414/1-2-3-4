package kz.saphena.api.configuration.security

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import mu.KotlinLogging
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.io.IOException

@Component
class AuthTokenFilter(
    private val jwtUtils: JwtUtils,
    private val userDetailsService: UserDetailsServiceImpl
) : OncePerRequestFilter() {

        private val log = KotlinLogging.logger {}

        @Throws(ServletException::class, IOException::class)
        override fun doFilterInternal(
            request: HttpServletRequest,
            response: HttpServletResponse,
            filterChain: FilterChain
        ) {
            val authorizationHeader = request.getHeader("Authorization")

            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                try {
                    val jwt = authorizationHeader.substringAfter("Bearer ")

                    if (jwtUtils.validateJwtToken(jwt)) {
                        val username = jwtUtils.getUsernameFromJwtToken(jwt)

                        val userDetails = userDetailsService.loadUserByUsername(username)

                        val authentication =
                            UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.authorities
                            )

                        authentication.details = WebAuthenticationDetailsSource().buildDetails(request)

                        SecurityContextHolder.getContext().authentication = authentication
                    }
                } catch (e: Exception) {
                    log.error(("""{"error": "Filter Authorization error: ${e.message ?: "unknown error"}"}"""))
                }
            }

            filterChain.doFilter(request, response)
        }
}