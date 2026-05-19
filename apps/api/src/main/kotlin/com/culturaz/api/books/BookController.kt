package com.culturaz.api.books

import com.culturaz.api.shared.responses.PagedResponse
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/books")
class BookController(private val bookService: BookService) {

    @GetMapping
    fun search(
        @RequestParam(required = false) q: String?,
        @RequestParam(required = false) categoryId: UUID?,
        @RequestParam(required = false) author: String?,
        @RequestParam(required = false) isbn: String?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
        @RequestParam(defaultValue = "title,asc") sort: String,
    ): PagedResponse<BookResponse> {
        val pageable = PageRequest.of(
            page.coerceAtLeast(0),
            size.coerceIn(1, 100),
            parseSort(sort),
        )
        val result = bookService.search(q, categoryId, author, isbn, pageable)
        return PagedResponse.from(result) { it.toResponse() }
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): BookResponse = bookService.getById(id).toResponse()

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    fun create(@Valid @RequestBody request: CreateBookRequest): ResponseEntity<BookResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(bookService.create(request).toResponse())

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    fun update(
        @PathVariable id: UUID,
        @Valid @RequestBody request: UpdateBookRequest,
    ): BookResponse = bookService.update(id, request).toResponse()

    private fun parseSort(sort: String): Sort {
        val parts = sort.split(",").map { it.trim() }
        val field = parts.getOrNull(0)?.takeIf { it.isNotBlank() } ?: "title"
        val direction = parts.getOrNull(1)?.lowercase() ?: "asc"
        return Sort.by(if (direction == "desc") Sort.Direction.DESC else Sort.Direction.ASC, field)
    }
}
