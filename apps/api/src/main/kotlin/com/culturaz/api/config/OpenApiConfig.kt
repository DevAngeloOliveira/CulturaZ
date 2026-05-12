package com.culturaz.api.config

import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Contact
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.info.License
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OpenApiConfig {

    @Bean
    fun openApi(): OpenAPI = OpenAPI()
        .info(
            Info()
                .title("CulturaZ API")
                .version("0.1.0")
                .description("API REST do marketplace CulturaZ.")
                .contact(Contact().name("Ângelo Oliveira").email("dev.angelooliveira@gmail.com"))
                .license(License().name("MIT"))
        )
}
