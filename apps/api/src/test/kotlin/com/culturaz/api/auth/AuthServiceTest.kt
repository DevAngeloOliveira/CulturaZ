package com.culturaz.api.auth

import com.culturaz.api.shared.exceptions.BusinessException
import com.culturaz.api.shared.exceptions.ConflictException
import com.culturaz.api.shared.exceptions.UnauthorizedException
import com.culturaz.api.users.User
import com.culturaz.api.users.UserRepository
import com.culturaz.api.users.UserRole
import com.culturaz.api.users.UserStatus
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.springframework.security.crypto.password.PasswordEncoder
import java.util.Optional
import java.util.UUID

class AuthServiceTest {

    private val userRepository = mockk<UserRepository>()
    private val passwordEncoder = mockk<PasswordEncoder>()
    private val jwtService = mockk<JwtService>()

    private val service = AuthService(userRepository, passwordEncoder, jwtService)

    @Test
    fun `register creates user with CUSTOMER role and hashes password`() {
        val request = RegisterRequest(
            name = "Gabriel",
            email = "Gabriel@email.com",
            password = "Senha12345",
            phone = "83999999999",
        )
        every { userRepository.existsByEmail("gabriel@email.com") } returns false
        every { passwordEncoder.encode("Senha12345") } returns "hashed"
        val saved = slot<User>()
        every { userRepository.save(capture(saved)) } answers { saved.captured.also { it.id = UUID.randomUUID() } }
        every { jwtService.generateAccessToken(any(), any(), any()) } returns "access"
        every { jwtService.generateRefreshToken(any(), any(), any()) } returns "refresh"
        every { jwtService.accessTokenExpirationSeconds() } returns 3600

        val result = service.register(request)

        assertEquals("gabriel@email.com", saved.captured.email)
        assertEquals("hashed", saved.captured.passwordHash)
        assertEquals(setOf(UserRole.CUSTOMER), saved.captured.roles)
        assertEquals("access", result.accessToken)
        assertEquals(3600L, result.expiresInSeconds)
    }

    @Test
    fun `register fails when email already exists`() {
        every { userRepository.existsByEmail("dup@email.com") } returns true

        val ex = assertThrows(ConflictException::class.java) {
            service.register(
                RegisterRequest(
                    name = "Dup",
                    email = "dup@email.com",
                    password = "Senha12345",
                    phone = null,
                ),
            )
        }
        assertEquals("EMAIL_ALREADY_EXISTS", ex.code)
    }

    @Test
    fun `login succeeds with valid credentials`() {
        val user = User(
            id = UUID.randomUUID(),
            name = "User",
            email = "user@email.com",
            passwordHash = "hash",
            status = UserStatus.ACTIVE,
            roles = mutableSetOf(UserRole.CUSTOMER),
        )
        every { userRepository.findByEmail("user@email.com") } returns Optional.of(user)
        every { passwordEncoder.matches("Senha12345", "hash") } returns true
        every { jwtService.generateAccessToken(user.id, user.email, any()) } returns "access"
        every { jwtService.generateRefreshToken(user.id, user.email, any()) } returns "refresh"
        every { jwtService.accessTokenExpirationSeconds() } returns 3600

        val response = service.login(LoginRequest(email = "user@email.com", password = "Senha12345"))

        assertNotNull(response.accessToken)
        assertEquals("user@email.com", response.user.email)
    }

    @Test
    fun `login fails with bad password`() {
        val user = User(
            name = "User",
            email = "user@email.com",
            passwordHash = "hash",
            status = UserStatus.ACTIVE,
        )
        every { userRepository.findByEmail("user@email.com") } returns Optional.of(user)
        every { passwordEncoder.matches("wrong", "hash") } returns false

        val ex = assertThrows(UnauthorizedException::class.java) {
            service.login(LoginRequest(email = "user@email.com", password = "wrong"))
        }
        assertEquals("INVALID_CREDENTIALS", ex.code)
    }

    @Test
    fun `login fails for blocked user`() {
        val user = User(
            name = "Blocked",
            email = "blocked@email.com",
            passwordHash = "hash",
            status = UserStatus.BLOCKED,
        )
        every { userRepository.findByEmail("blocked@email.com") } returns Optional.of(user)
        every { passwordEncoder.matches("Senha12345", "hash") } returns true

        val ex = assertThrows(BusinessException::class.java) {
            service.login(LoginRequest(email = "blocked@email.com", password = "Senha12345"))
        }
        assertEquals("USER_BLOCKED", ex.code)
    }
}
