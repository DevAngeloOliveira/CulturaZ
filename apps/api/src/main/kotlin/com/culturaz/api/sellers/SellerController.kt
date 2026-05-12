package com.culturaz.api.sellers

import com.culturaz.api.shared.responses.ModuleHealth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Módulo: Sellers
 *
 * Endpoints previstos:
 *  - POST /api/sellers
 *  - GET  /api/sellers/me
 *  - PUT  /api/sellers/me
 *  - GET  /api/sellers/{id}
 *  - GET  /api/sellers/{id}/reviews
 *
 * Implementação: entrega 5.
 */
@RestController
@RequestMapping("/api/sellers")
class SellerController {

    @GetMapping("/health")
    fun health(): ModuleHealth = ModuleHealth(module = "sellers")
}
