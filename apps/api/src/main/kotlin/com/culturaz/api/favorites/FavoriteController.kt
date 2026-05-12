package com.culturaz.api.favorites

import com.culturaz.api.shared.responses.ModuleHealth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/favorites")
class FavoriteController {

    @GetMapping("/health")
    fun health(): ModuleHealth = ModuleHealth(module = "favorites")
}
