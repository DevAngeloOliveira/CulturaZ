package com.culturaz.api.listings

import com.culturaz.api.shared.responses.ModuleHealth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Módulo: Listings
 *
 * Endpoints previstos:
 *  - GET    /api/listings
 *  - GET    /api/listings/{id}
 *  - POST   /api/seller/listings
 *  - PUT    /api/seller/listings/{id}
 *  - PATCH  /api/seller/listings/{id}/pause
 *  - PATCH  /api/seller/listings/{id}/activate
 *  - DELETE /api/seller/listings/{id}
 *  - PATCH  /api/admin/listings/{id}/approve
 *  - PATCH  /api/admin/listings/{id}/block
 *
 * Implementação: entrega 3 (catálogo público + vendedor) e entrega 6 (admin).
 */
@RestController
@RequestMapping("/api/listings")
class ListingController {

    @GetMapping("/health")
    fun health(): ModuleHealth = ModuleHealth(module = "listings")
}
