package com.culturaz.api.reviews

import com.culturaz.api.shared.security.requireAuthUser
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/reviews")
@SecurityRequirement(name = "bearerAuth")
class ReviewController(private val reviewService: ReviewService) {

    @PostMapping
    fun create(@Valid @RequestBody request: CreateReviewRequest): ResponseEntity<ReviewResponse> {
        val auth = requireAuthUser()
        val saved = reviewService.create(auth.id, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.toResponse())
    }
}
