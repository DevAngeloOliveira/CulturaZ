package com.culturaz.api.shared.security

import com.culturaz.api.users.UserRole
import java.util.UUID

data class AuthUser(
    val id: UUID,
    val email: String,
    val roles: Set<UserRole>,
) {
    fun hasRole(role: UserRole): Boolean = roles.contains(role)
}
