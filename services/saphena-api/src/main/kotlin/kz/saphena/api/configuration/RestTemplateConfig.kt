package kz.saphena.api.configuration

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.client.RestTemplate

/**
 * Configuration for RestTemplate
 */
@Configuration
class RestTemplateConfig {
    
    /**
     * Creates a RestTemplate bean for HTTP requests
     */
    @Bean
    fun restTemplate(): RestTemplate {
        return RestTemplate()
    }
}
