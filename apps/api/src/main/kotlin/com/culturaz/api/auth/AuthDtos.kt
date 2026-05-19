package com.culturaz.api.auth

import com.culturaz.api.users.UserResponse
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

data class RegisterRequest(
    @field:NotBlank(message = "Nome é obrigatório.")
    @field:Size(min = 2, max = 120)
    val name: String,

    @field:NotBlank(message = "E-mail é obrigatório.")
    @field:Email(message = "E-mail inválido.")
    @field:Size(max = 160)
    val email: String,

    @field:NotBlank(message = "Senha é obrigatória.")
    @field:Size(min = 8, max = 100, message = "Senha deve ter no mínimo 8 caracteres.")
    @field:Pattern(
        regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
        message = "Senha deve conter letras e números.",
    )
    val password: String,

    @field:Size(max = 20)
    val phone: String?,
)

data class LoginRequest(
    @field:NotBlank(message = "E-mail é obrigatório.")
    @field:Email(message = "E-mail inválido.")
    val email: String,

    @field:NotBlank(message = "Senha é obrigatória.")
    val password: String,
)

data class RefreshTokenRequest(
    @field:NotBlank(message = "Refresh token é obrigatório.")
    val refreshToken: String,
)

data class AuthResponse(
    val accessToken: String,
    val refreshToken: String,
    val expiresInSeconds: Long,
    val user: UserResponse,
)
