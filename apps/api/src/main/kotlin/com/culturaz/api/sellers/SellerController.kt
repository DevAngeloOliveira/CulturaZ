package com.culturaz.api.sellers

import com.culturaz.api.shared.responses.ModuleHealth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/sellers")
class SellerController {

    @GetMapping("/health")
    fun health(): ModuleHealth = ModuleHealth(module = "sellers")
}
