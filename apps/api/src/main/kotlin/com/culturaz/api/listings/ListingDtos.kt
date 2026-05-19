package com.culturaz.api.listings

import com.culturaz.api.books.BookResponse
import com.culturaz.api.books.toResponse
import com.culturaz.api.sellers.SellerProfileResponse
import com.culturaz.api.sellers.toResponse
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

data class ListingResponse(
    val id: UUID,
    val book: BookResponse,
    val seller: SellerProfileResponse,
    val price: BigDecimal,
    val originalPrice: BigDecimal?,
    val stockQuantity: Int,
    val condition: BookCondition,
    val status: ListingStatus,
    val coverImageUrl: String?,
    val description: String,
    val city: String?,
    val state: String?,
    val createdAt: Instant,
    val updatedAt: Instant,
)

data class CreateListingRequest(
    @field:NotNull(message = "Livro é obrigatório.")
    val bookId: UUID,

    @field:NotNull(message = "Preço é obrigatório.")
    @field:DecimalMin(value = "0.01", message = "Preço deve ser maior que zero.")
    val price: BigDecimal,

    @field:DecimalMin(value = "0.01", message = "Preço original deve ser maior que zero quando informado.")
    val originalPrice: BigDecimal?,

    @field:Min(value = 0, message = "Estoque não pode ser negativo.")
    val stockQuantity: Int,

    @field:NotNull(message = "Condição é obrigatória.")
    val condition: BookCondition,

    @field:NotBlank(message = "Descrição é obrigatória.")
    @field:Size(max = 4000)
    val description: String,

    @field:Size(max = 500)
    val coverImageUrl: String?,

    @field:Size(max = 120)
    val city: String?,

    @field:Size(min = 2, max = 2)
    val state: String?,
)

data class UpdateListingRequest(
    @field:NotNull
    @field:DecimalMin(value = "0.01")
    val price: BigDecimal,

    @field:DecimalMin(value = "0.01")
    val originalPrice: BigDecimal?,

    @field:Min(value = 0)
    val stockQuantity: Int,

    @field:NotNull
    val condition: BookCondition,

    @field:NotBlank
    @field:Size(max = 4000)
    val description: String,

    @field:Size(max = 500)
    val coverImageUrl: String?,

    @field:Size(max = 120)
    val city: String?,

    @field:Size(min = 2, max = 2)
    val state: String?,
)

fun BookListing.toResponse() = ListingResponse(
    id = id,
    book = book.toResponse(),
    seller = seller.toResponse(),
    price = price,
    originalPrice = originalPrice,
    stockQuantity = stockQuantity,
    condition = condition,
    status = status,
    coverImageUrl = coverImageUrl,
    description = description,
    city = city,
    state = state,
    createdAt = createdAt,
    updatedAt = updatedAt,
)
