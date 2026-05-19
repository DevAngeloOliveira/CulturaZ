package com.culturaz.api.categories

import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class CategoryController(private val categoryService: CategoryService) {

    @GetMapping("/api/categories")
    fun list(): List<CategoryResponse> =
        categoryService.listActive().map { it.toResponse() }

    @GetMapping("/api/categories/{id}")
    fun getById(@PathVariable id: UUID): CategoryResponse =
        categoryService.getById(id).toResponse()

    @PostMapping("/api/admin/categories")
    @SecurityRequirement(name = "bearerAuth")
    fun create(@Valid @RequestBody request: CreateCategoryRequest): ResponseEntity<CategoryResponse> {
        val saved = categoryService.create(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.toResponse())
    }

    @PutMapping("/api/admin/categories/{id}")
    @SecurityRequirement(name = "bearerAuth")
    fun update(
        @PathVariable id: UUID,
        @Valid @RequestBody request: UpdateCategoryRequest,
    ): CategoryResponse = categoryService.update(id, request).toResponse()

    @PatchMapping("/api/admin/categories/{id}/activate")
    @SecurityRequirement(name = "bearerAuth")
    fun activate(@PathVariable id: UUID): CategoryResponse =
        categoryService.activate(id).toResponse()

    @PatchMapping("/api/admin/categories/{id}/deactivate")
    @SecurityRequirement(name = "bearerAuth")
    fun deactivate(@PathVariable id: UUID): CategoryResponse =
        categoryService.deactivate(id).toResponse()
}

@RestController
@RequestMapping("/api/admin/categories/listing")
@SecurityRequirement(name = "bearerAuth")
class AdminCategoryListingController(private val categoryService: CategoryService) {

    @GetMapping
    fun listAll(): List<CategoryResponse> = categoryService.listAll().map { it.toResponse() }
}
