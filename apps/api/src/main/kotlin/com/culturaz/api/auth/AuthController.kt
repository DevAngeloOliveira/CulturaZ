package com.culturaz.api.auth

import com.culturaz.api.shared.responses.ModuleHealth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController {

    @GetMapping("/health")
    fun health(): ModuleHealth = ModuleHealth(module = "auth")
}
