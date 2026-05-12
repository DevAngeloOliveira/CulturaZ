package com.culturaz.api.books

import com.culturaz.api.shared.responses.ModuleHealth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Módulo: Books
 *
 * Endpoints previstos:
 *  - GET  /api/books
 *  - GET  /api/books/{id}
 *  - POST /api/books
 *  - PUT  /api/books/{id}
 *
 * Implementação: entrega 3.
 */
@RestController
@RequestMapping("/api/books")
class BookController {

    @GetMapping("/health")
    fun health(): ModuleHealth = ModuleHealth(module = "books")
}
