package com.culturaz.api.reviews

import com.culturaz.api.shared.responses.ModuleHealth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/reviews")
class ReviewController {

    @GetMapping("/health")
    fun health(): ModuleHealth = ModuleHealth(module = "reviews")
}
