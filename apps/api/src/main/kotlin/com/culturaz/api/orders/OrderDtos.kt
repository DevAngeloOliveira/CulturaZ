package com.culturaz.api.orders

import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

data class OrderItemResponse(
    val id: UUID,
    val listingId: UUID,
    val sellerId: UUID,
    val bookTitle: String,
    val quantity: Int,
    val unitPrice: BigDecimal,
    val subtotal: BigDecimal,
)

data class OrderResponse(
    val id: UUID,
    val code: String,
    val buyerId: UUID,
    val status: OrderStatus,
    val paymentStatus: PaymentStatus,
    val subtotalAmount: BigDecimal,
    val shippingAmount: BigDecimal,
    val totalAmount: BigDecimal,
    val shippingAddressId: UUID?,
    val items: List<OrderItemResponse>,
    val createdAt: Instant,
    val updatedAt: Instant,
)

enum class PaymentMethod {
    SIMULATED,
}

data class CreateOrderRequest(
    @field:NotNull(message = "Endereço de entrega é obrigatório.")
    val shippingAddressId: UUID,

    val paymentMethod: PaymentMethod = PaymentMethod.SIMULATED,
)

data class UpdateOrderStatusRequest(
    @field:NotNull(message = "Status é obrigatório.")
    val status: OrderStatus,
)

data class CancelOrderRequest(
    @field:Size(max = 500)
    val reason: String? = null,
)

fun OrderItem.toResponse() = OrderItemResponse(
    id = id,
    listingId = listing.id,
    sellerId = seller.id,
    bookTitle = bookTitle,
    quantity = quantity,
    unitPrice = unitPrice,
    subtotal = subtotal,
)

fun Order.toResponse() = OrderResponse(
    id = id,
    code = code,
    buyerId = buyer.id,
    status = status,
    paymentStatus = paymentStatus,
    subtotalAmount = subtotalAmount,
    shippingAmount = shippingAmount,
    totalAmount = totalAmount,
    shippingAddressId = shippingAddress?.id,
    items = items.map { it.toResponse() },
    createdAt = createdAt,
    updatedAt = updatedAt,
)
