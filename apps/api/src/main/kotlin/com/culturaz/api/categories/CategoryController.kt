package com.culturaz.api.categories

import com.culturaz.api.shared.responses.ModuleHealth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Módulo: Categories
 *
 * Endpoints previstos:
 *  - GET   /api/categories
 *  - POST  /api/admin/categories
 *  - PUT   /api/admin/categories/{id}
 *  - PATCH /api/admin/categories/{id}/activate
 *  - PATCH /api/admin/categories/{id}/deactivate
 *
 * Implementação: entrega 3 (público) e entrega 6 (admin).
 */
@RestController
@RequestMapping("/api/categories")
class CategoryController {

    @GetMapping("/health")
    fun health(): ModuleHealth = ModuleHealth(module = "categories")
}
