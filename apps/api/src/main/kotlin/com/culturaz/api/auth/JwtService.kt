package com.culturaz.api.auth

import com.culturaz.api.shared.security.JwtProperties
import com.culturaz.api.users.UserRole
import io.jsonwebtoken.Claims
import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Service
import java.nio.charset.StandardCharsets
import java.time.Instant
import java.util.Date
import java.util.UUID
import javax.crypto.SecretKey

data class JwtPayload(
    val userId: UUID,
    val email: String,
    val roles: Set<UserRole>,
    val type: TokenType,
    val expiresAt: Instant,
) {
    enum class TokenType { ACCESS, REFRESH }
}

@Service
class JwtService(private val properties: JwtProperties) {

    private val key: SecretKey = Keys.hmacShaKeyFor(properties.secret.toByteArray(StandardCharsets.UTF_8))

    fun generateAccessToken(userId: UUID, email: String, roles: Set<UserRole>): String =
        buildToken(userId, email, roles, JwtPayload.TokenType.ACCESS, properties.accessTokenExpirationSeconds)

    fun generateRefreshToken(userId: UUID, email: String, roles: Set<UserRole>): String =
        buildToken(userId, email, roles, JwtPayload.TokenType.REFRESH, properties.refreshTokenExpirationSeconds)

    fun accessTokenExpirationSeconds(): Long = properties.accessTokenExpirationSeconds

    fun parse(token: String): JwtPayload {
        val claims = try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token).payload
        } catch (ex: JwtException) {
            throw InvalidTokenException("Token inválido ou expirado.")
        } catch (ex: IllegalArgumentException) {
            throw InvalidTokenException("Token ausente.")
        }
        return claims.toPayload()
    }

    private fun buildToken(
        userId: UUID,
        email: String,
        roles: Set<UserRole>,
        type: JwtPayload.TokenType,
        expirationSeconds: Long,
    ): String {
        val now = Instant.now()
        val expiration = now.plusSeconds(expirationSeconds)
        return Jwts.builder()
            .issuer(properties.issuer)
            .subject(email)
            .claim("userId", userId.toString())
            .claim("roles", roles.map { it.name })
            .claim("type", type.name)
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiration))
            .signWith(key)
            .compact()
    }

    private fun Claims.toPayload(): JwtPayload {
        val userIdStr = get("userId", String::class.java)
            ?: throw InvalidTokenException("Claim 'userId' ausente.")
        val rolesClaim = get("roles", List::class.java) ?: emptyList<Any>()
        val typeStr = get("type", String::class.java) ?: JwtPayload.TokenType.ACCESS.name
        val roles = rolesClaim.filterIsInstance<String>().mapNotNull {
            runCatching { UserRole.valueOf(it) }.getOrNull()
        }.toSet()
        return JwtPayload(
            userId = UUID.fromString(userIdStr),
            email = subject ?: throw InvalidTokenException("Subject ausente."),
            roles = roles,
            type = runCatching { JwtPayload.TokenType.valueOf(typeStr) }.getOrDefault(JwtPayload.TokenType.ACCESS),
            expiresAt = expiration.toInstant(),
        )
    }
}

class InvalidTokenException(message: String) : RuntimeException(message)
