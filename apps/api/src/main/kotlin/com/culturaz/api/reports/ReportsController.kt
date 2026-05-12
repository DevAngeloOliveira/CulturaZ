package com.culturaz.api.reports

import com.culturaz.api.shared.responses.ModuleHealth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/reports")
class ReportsController {

    @GetMapping("/health")
    fun health(): ModuleHealth = ModuleHealth(module = "reports")
}
