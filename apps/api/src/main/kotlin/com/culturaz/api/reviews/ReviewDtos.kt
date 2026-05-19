package com.culturaz.api.reviews

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.time.Instant
import java.util.UUID

data class ReviewResponse(
    val id: UUID,
    val sellerId: UUID,
    val orderId: UUID,
    val reviewerName: String,
    val rating: Int,
    val comment: String?,
    val tags: List<String>,
    val createdAt: Instant,
)

data class CreateReviewRequest(
    @field:NotNull
    val orderId: UUID,

    @field:NotNull
    val sellerId: UUID,

    @field:Min(1, message = "Nota mínima é 1.")
    @field:Max(5, message = "Nota máxima é 5.")
    val rating: Int,

    @field:Size(max = 2000)
    val comment: String?,

    val tags: List<@Size(max = 60) String>? = null,
)

fun Review.toResponse() = ReviewResponse(
    id = id,
    sellerId = seller.id,
    orderId = order.id,
    reviewerName = reviewer.name,
    rating = rating,
    comment = comment,
    tags = tags?.split(",")?.mapNotNull { it.trim().takeIf { t -> t.isNotEmpty() } } ?: emptyList(),
    createdAt = createdAt,
)
