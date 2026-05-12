package com.culturaz.api.reports

import com.culturaz.api.shared.responses.ModuleHealth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Módulo: Reports
 *
 * Endpoints previstos:
 *  - GET /api/admin/reports
 *  - GET /api/seller/reports
 *
 * Implementação: entrega 5 (vendedor) e entrega 6 (admin).
 */
@RestController
@RequestMapping("/api/reports")
class ReportsController {

    @GetMapping("/health")
    fun health(): ModuleHealth = ModuleHealth(module = "reports")
}
