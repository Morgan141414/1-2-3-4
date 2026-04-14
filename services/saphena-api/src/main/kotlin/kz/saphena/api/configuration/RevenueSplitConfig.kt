package kz.saphena.api.configuration

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration
import java.math.BigDecimal

@Configuration
@ConfigurationProperties(prefix = "revenue.split")
class RevenueSplitConfig {
    var doctorClientRatio: BigDecimal = BigDecimal("0.5")
    var clinicClientRatio: BigDecimal = BigDecimal("0.25")
}
