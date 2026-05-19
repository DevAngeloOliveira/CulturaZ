package com.culturaz.api.users

import com.culturaz.api.shared.security.requireAuthUser
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/users")
@SecurityRequirement(name = "bearerAuth")
class UserController(private val userService: UserService) {

    @GetMapping("/me")
    fun me(): UserResponse {
        val auth = requireAuthUser()
        return userService.getById(auth.id).toResponse()
    }

    @PutMapping("/me")
    fun updateMe(@Valid @RequestBody request: UpdateUserRequest): UserResponse {
        val auth = requireAuthUser()
        return userService.updateProfile(auth.id, request).toResponse()
    }
}
