package com.culturaz.api.shared.security

import com.culturaz.api.auth.JwtAuthenticationFilter
import com.culturaz.api.shared.responses.ApiErrorResponse
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
@EnableConfigurationProperties(JwtProperties::class)
class SecurityConfig(private val objectMapper: ObjectMapper) {

    @Bean
    fun filterChain(http: HttpSecurity, jwtAuthFilter: JwtAuthenticationFilter): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .cors { }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .httpBasic { it.disable() }
            .formLogin { it.disable() }
            .exceptionHandling {
                it.authenticationEntryPoint { request, response, _ ->
                    response.status = HttpStatus.UNAUTHORIZED.value()
                    response.contentType = MediaType.APPLICATION_JSON_VALUE
                    response.characterEncoding = Charsets.UTF_8.name()
                    val body = ApiErrorResponse(
                        code = "AUTHENTICATION_REQUIRED",
                        message = "Autenticação necessária para acessar este recurso.",
                        path = request.requestURI,
                    )
                    response.outputStream.write(objectMapper.writeValueAsBytes(body))
                }
                it.accessDeniedHandler { request, response, _ ->
                    response.status = HttpStatus.FORBIDDEN.value()
                    response.contentType = MediaType.APPLICATION_JSON_VALUE
                    response.characterEncoding = Charsets.UTF_8.name()
                    val body = ApiErrorResponse(
                        code = "ACCESS_DENIED",
                        message = "Você não tem permissão para acessar este recurso.",
                        path = request.requestURI,
                    )
                    response.outputStream.write(objectMapper.writeValueAsBytes(body))
                }
            }
            .authorizeHttpRequests { auth ->
                auth.requestMatchers(
                    HttpMethod.POST,
                    "/api/auth/register",
                    "/api/auth/login",
                    "/api/auth/refresh",
                ).permitAll()

                auth.requestMatchers(
                    HttpMethod.GET,
                    "/api/categories",
                    "/api/categories/*",
                    "/api/books",
                    "/api/books/*",
                    "/api/listings",
                    "/api/listings/*",
                    "/api/sellers/*",
                    "/api/sellers/*/reviews",
                ).permitAll()

                auth.requestMatchers(
                    "/actuator/health",
                    "/actuator/info",
                    "/v3/api-docs",
                    "/v3/api-docs/**",
                    "/v3/api-docs.yaml",
                    "/swagger-ui.html",
                    "/swagger-ui/**",
                ).permitAll()

                auth.requestMatchers("/api/admin/**").hasRole("ADMIN")
                auth.requestMatchers("/api/seller/**").hasRole("SELLER")

                auth.anyRequest().authenticated()
            }
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)
        return http.build()
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder(12)

    @Bean
    fun authenticationManager(config: AuthenticationConfiguration): AuthenticationManager =
        config.authenticationManager
}
