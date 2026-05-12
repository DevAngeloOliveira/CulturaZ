package com.culturaz.api.orders

import com.culturaz.api.shared.responses.ModuleHealth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Módulo: Orders
 *
 * Endpoints previstos:
 *  - POST  /api/orders
 *  - GET   /api/orders/me
 *  - GET   /api/orders/{id}
 *  - PATCH /api/orders/{id}/cancel
 *  - GET   /api/seller/orders
 *  - GET   /api/seller/orders/{id}
 *  - PATCH /api/seller/orders/{id}/status
 *  - GET   /api/admin/orders
 *  - GET   /api/admin/orders/{id}
 *
 * Implementação: entrega 4 (comprador) e entrega 5 (vendedor) e entrega 6 (admin).
 */
@RestController
@RequestMapping("/api/orders")
class OrderController {

    @GetMapping("/health")
    fun health(): ModuleHealth = ModuleHealth(module = "orders")
}
