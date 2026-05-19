package com.culturaz.api.cart

import com.culturaz.api.listings.ListingResponse
import com.culturaz.api.listings.toResponse
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import java.math.BigDecimal
import java.util.UUID

data class CartItemResponse(
    val id: UUID,
    val listing: ListingResponse,
    val quantity: Int,
    val unitPrice: BigDecimal,
    val subtotal: BigDecimal,
)

data class CartResponse(
    val id: UUID,
    val items: List<CartItemResponse>,
    val subtotalAmount: BigDecimal,
    val itemsCount: Int,
)

data class AddCartItemRequest(
    @field:NotNull(message = "Anúncio é obrigatório.")
    val listingId: UUID,

    @field:Min(1, message = "Quantidade mínima é 1.")
    val quantity: Int = 1,
)

data class UpdateCartItemRequest(
    @field:Min(1, message = "Quantidade mínima é 1.")
    val quantity: Int,
)

fun CartItem.toResponse(): CartItemResponse = CartItemResponse(
    id = id,
    listing = listing.toResponse(),
    quantity = quantity,
    unitPrice = unitPrice,
    subtotal = unitPrice.multiply(BigDecimal(quantity)),
)

fun Cart.toResponse(): CartResponse {
    val items = items.map { it.toResponse() }
    val subtotal = items.fold(BigDecimal.ZERO) { acc, item -> acc.add(item.subtotal) }
    return CartResponse(
        id = id,
        items = items,
        subtotalAmount = subtotal,
        itemsCount = items.sumOf { it.quantity },
    )
}
