package kz.saphena.api.configuration

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.math.BigDecimal
import java.math.RoundingMode

@Configuration
class JacksonConfig {

    @Bean
    fun jacksonCustomizer(): Jackson2ObjectMapperBuilderCustomizer {
        return Jackson2ObjectMapperBuilderCustomizer { builder ->
            builder.serializerByType(BigDecimal::class.java, object : JsonSerializer<BigDecimal>() {
                override fun serialize(value: BigDecimal?, gen: JsonGenerator, serializers: SerializerProvider) {
                    if (value == null) {
                        gen.writeNull()
                    } else {
                        // Force 2 decimal places globally for all JSON responses
                        gen.writeNumber(value.setScale(2, RoundingMode.HALF_UP))
                    }
                }
            })
        }
    }
}
