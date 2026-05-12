package com.culturaz.api.cart

import com.culturaz.api.shared.responses.ModuleHealth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/cart")
class CartController {

    @GetMapping("/health")
    fun health(): ModuleHealth = ModuleHealth(module = "cart")
}
