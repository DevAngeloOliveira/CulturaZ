package com.culturaz.api.config

import io.swagger.v3.oas.models.Components
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Contact
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.info.License
import io.swagger.v3.oas.models.security.SecurityScheme
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OpenApiConfig {

    @Bean
    fun openApi(): OpenAPI {
        val bearerScheme = SecurityScheme()
            .type(SecurityScheme.Type.HTTP)
            .scheme("bearer")
            .bearerFormat("JWT")

        return OpenAPI()
            .info(
                Info()
                    .title("CulturaZ API")
                    .version("0.2.0")
                    .description("API REST do marketplace CulturaZ.")
                    .contact(Contact().name("Ângelo Oliveira").email("dev.angelooliveira@gmail.com"))
                    .license(License().name("MIT")),
            )
            .components(Components().addSecuritySchemes("bearerAuth", bearerScheme))
    }
}
