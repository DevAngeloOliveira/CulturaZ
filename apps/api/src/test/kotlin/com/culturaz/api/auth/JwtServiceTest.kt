package com.culturaz.api.auth

import com.culturaz.api.shared.security.JwtProperties
import com.culturaz.api.users.UserRole
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import java.util.UUID

class JwtServiceTest {

    private val properties = JwtProperties(
        secret = "test-secret-must-be-very-long-to-satisfy-hmac-sha256-key-requirement-padding-padding",
        accessTokenExpirationSeconds = 3600,
        refreshTokenExpirationSeconds = 86_400,
    )
    private val service = JwtService(properties)

    @Test
    fun `access token round trip preserves claims`() {
        val userId = UUID.randomUUID()
        val token = service.generateAccessToken(userId, "user@email.com", setOf(UserRole.CUSTOMER, UserRole.SELLER))
        val payload = service.parse(token)
        assertEquals(userId, payload.userId)
        assertEquals("user@email.com", payload.email)
        assertEquals(setOf(UserRole.CUSTOMER, UserRole.SELLER), payload.roles)
        assertEquals(JwtPayload.TokenType.ACCESS, payload.type)
    }

    @Test
    fun `refresh token has refresh type`() {
        val token = service.generateRefreshToken(UUID.randomUUID(), "user@email.com", setOf(UserRole.CUSTOMER))
        val payload = service.parse(token)
        assertEquals(JwtPayload.TokenType.REFRESH, payload.type)
    }

    @Test
    fun `invalid token throws InvalidTokenException`() {
        assertThrows(InvalidTokenException::class.java) {
            service.parse("not-a-real-token")
        }
    }
}
