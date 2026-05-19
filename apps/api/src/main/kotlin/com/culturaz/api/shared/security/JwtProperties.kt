package com.culturaz.api.shared.security

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "culturaz.security.jwt")
data class JwtProperties(
    var secret: String = "dev-secret-change-me-in-production-please-use-a-real-random-secret-at-least-256-bits-long",
    var accessTokenExpirationSeconds: Long = 3600,
    var refreshTokenExpirationSeconds: Long = 2_592_000,
    var issuer: String = "culturaz-api",
)
