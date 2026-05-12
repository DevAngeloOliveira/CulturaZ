package com.culturaz.api.auth

import com.culturaz.api.shared.responses.ModuleHealth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Módulo: Auth
 *
 * Endpoints previstos (ver packages/contracts/openapi.yaml):
 *  - POST /api/auth/register
 *  - POST /api/auth/login
 *  - POST /api/auth/logout
 *  - GET  /api/auth/me
 *
 * Implementação: entrega 2.
 */
@RestController
@RequestMapping("/api/auth")
class AuthController {

    @GetMapping("/health")
    fun health(): ModuleHealth = ModuleHealth(module = "auth")
}
