package com.culturaz.api.auth

import com.culturaz.api.shared.security.requireAuthUser
import com.culturaz.api.users.UserResponse
import com.culturaz.api.users.UserService
import com.culturaz.api.users.toResponse
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService,
    private val userService: UserService,
) {

    @PostMapping("/register")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<AuthResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request))

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): AuthResponse = authService.login(request)

    @PostMapping("/refresh")
    fun refresh(@Valid @RequestBody request: RefreshTokenRequest): AuthResponse = authService.refresh(request)

    @PostMapping("/logout")
    @SecurityRequirement(name = "bearerAuth")
    fun logout(): ResponseEntity<Void> {
        requireAuthUser()
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    fun me(): UserResponse {
        val auth = requireAuthUser()
        return userService.getById(auth.id).toResponse()
    }
}
