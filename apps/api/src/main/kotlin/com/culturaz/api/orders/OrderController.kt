package com.culturaz.api.orders

import com.culturaz.api.shared.responses.ModuleHealth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/orders")
class OrderController {

    @GetMapping("/health")
    fun health(): ModuleHealth = ModuleHealth(module = "orders")
}
