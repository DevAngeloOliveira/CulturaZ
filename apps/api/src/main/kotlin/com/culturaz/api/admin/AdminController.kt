package com.culturaz.api.admin

import com.culturaz.api.shared.responses.ModuleHealth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Módulo: Admin
 *
 * Endpoints previstos:
 *  - GET   /api/admin/dashboard
 *  - GET   /api/admin/users
 *  - PATCH /api/admin/users/{id}/block
 *  - PATCH /api/admin/users/{id}/unblock
 *  - GET   /api/admin/reports
 *
 * Implementação: entrega 6.
 */
@RestController
@RequestMapping("/api/admin")
class AdminController {

    @GetMapping("/health")
    fun health(): ModuleHealth = ModuleHealth(module = "admin")
}
