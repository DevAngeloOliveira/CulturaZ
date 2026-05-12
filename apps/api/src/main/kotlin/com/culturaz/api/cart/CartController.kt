package com.culturaz.api.cart

import com.culturaz.api.shared.responses.ModuleHealth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Módulo: Cart
 *
 * Endpoints previstos:
 *  - GET    /api/cart
 *  - POST   /api/cart/items
 *  - PUT    /api/cart/items/{id}
 *  - DELETE /api/cart/items/{id}
 *  - DELETE /api/cart
 *
 * Implementação: entrega 4.
 */
@RestController
@RequestMapping("/api/cart")
class CartController {

    @GetMapping("/health")
    fun health(): ModuleHealth = ModuleHealth(module = "cart")
}
