package com.culturaz.api.listings

import com.culturaz.api.shared.responses.ModuleHealth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/listings")
class ListingController {

    @GetMapping("/health")
    fun health(): ModuleHealth = ModuleHealth(module = "listings")
}
