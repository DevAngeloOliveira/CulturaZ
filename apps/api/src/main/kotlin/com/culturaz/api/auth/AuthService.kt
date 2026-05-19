package com.culturaz.api.auth

import com.culturaz.api.shared.exceptions.BusinessException
import com.culturaz.api.shared.exceptions.ConflictException
import com.culturaz.api.shared.exceptions.UnauthorizedException
import com.culturaz.api.users.User
import com.culturaz.api.users.UserRepository
import com.culturaz.api.users.UserRole
import com.culturaz.api.users.UserStatus
import com.culturaz.api.users.toResponse
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService,
) {

    @Transactional
    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByEmail(request.email.lowercase())) {
            throw ConflictException(code = "EMAIL_ALREADY_EXISTS", message = "Já existe uma conta com este e-mail.")
        }
        val user = User(
            name = request.name.trim(),
            email = request.email.trim().lowercase(),
            passwordHash = passwordEncoder.encode(request.password),
            phone = request.phone?.takeIf { it.isNotBlank() },
            status = UserStatus.ACTIVE,
            roles = mutableSetOf(UserRole.CUSTOMER),
        )
        val saved = userRepository.save(user)
        return buildAuthResponse(saved)
    }

    @Transactional(readOnly = true)
    fun login(request: LoginRequest): AuthResponse {
        val email = request.email.trim().lowercase()
        val user = userRepository.findByEmail(email).orElseThrow {
            UnauthorizedException(code = "INVALID_CREDENTIALS", message = "E-mail ou senha inválidos.")
        }
        if (!passwordEncoder.matches(request.password, user.passwordHash)) {
            throw UnauthorizedException(code = "INVALID_CREDENTIALS", message = "E-mail ou senha inválidos.")
        }
        ensureUserCanAuthenticate(user)
        return buildAuthResponse(user)
    }

    @Transactional(readOnly = true)
    fun refresh(request: RefreshTokenRequest): AuthResponse {
        val payload = try {
            jwtService.parse(request.refreshToken)
        } catch (ex: InvalidTokenException) {
            throw UnauthorizedException(code = "INVALID_TOKEN", message = ex.message ?: "Refresh token inválido.")
        }
        if (payload.type != JwtPayload.TokenType.REFRESH) {
            throw UnauthorizedException(code = "INVALID_TOKEN", message = "Refresh token esperado.")
        }
        val user = userRepository.findById(payload.userId).orElseThrow {
            UnauthorizedException(code = "INVALID_TOKEN", message = "Usuário do token não encontrado.")
        }
        ensureUserCanAuthenticate(user)
        return buildAuthResponse(user)
    }

    private fun ensureUserCanAuthenticate(user: User) {
        when (user.status) {
            UserStatus.BLOCKED -> throw BusinessException(
                code = "USER_BLOCKED",
                message = "Sua conta está bloqueada. Entre em contato com o suporte.",
                httpStatus = HttpStatus.FORBIDDEN,
            )
            UserStatus.DELETED -> throw UnauthorizedException(
                code = "INVALID_CREDENTIALS",
                message = "E-mail ou senha inválidos.",
            )
            else -> Unit
        }
    }

    private fun buildAuthResponse(user: User): AuthResponse {
        val roles = user.roles.toSet()
        val access = jwtService.generateAccessToken(user.id, user.email, roles)
        val refresh = jwtService.generateRefreshToken(user.id, user.email, roles)
        return AuthResponse(
            accessToken = access,
            refreshToken = refresh,
            expiresInSeconds = jwtService.accessTokenExpirationSeconds(),
            user = user.toResponse(),
        )
    }
}
