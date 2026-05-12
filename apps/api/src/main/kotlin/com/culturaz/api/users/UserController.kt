package com.culturaz.api.users

import com.culturaz.api.shared.responses.ModuleHealth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Módulo: Users
 *
 * Endpoints previstos:
 *  - GET    /api/users/me
 *  - PUT    /api/users/me
 *  - GET    /api/users/me/addresses
 *  - POST   /api/users/me/addresses
 *  - PUT    /api/users/me/addresses/{id}
 *  - DELETE /api/users/me/addresses/{id}
 *
 * Implementação: entrega 2.
 */
@RestController
@RequestMapping("/api/users")
class UserController {

    @GetMapping("/health")
    fun health(): ModuleHealth = ModuleHealth(module = "users")
}
