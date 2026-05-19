package com.culturaz.api.shared.security

import com.culturaz.api.shared.exceptions.ForbiddenException
import com.culturaz.api.shared.exceptions.UnauthorizedException
import org.springframework.security.core.context.SecurityContextHolder

fun currentAuthUserOrNull(): AuthUser? =
    SecurityContextHolder.getContext().authentication?.principal as? AuthUser

fun requireAuthUser(): AuthUser =
    currentAuthUserOrNull()
        ?: throw UnauthorizedException(
            code = "AUTHENTICATION_REQUIRED",
            message = "Autenticação necessária para acessar este recurso.",
        )

fun requireSameUser(userId: java.util.UUID) {
    val auth = requireAuthUser()
    if (auth.id != userId) {
        throw ForbiddenException(message = "Você só pode acessar seus próprios recursos.")
    }
}
