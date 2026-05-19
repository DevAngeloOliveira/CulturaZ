package com.culturaz.api.sellers

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.math.BigDecimal
import java.util.UUID

data class SellerProfileResponse(
    val id: UUID,
    val userId: UUID,
    val storeName: String,
    val description: String?,
    val type: SellerType,
    val rating: BigDecimal,
    val status: SellerStatus,
)

data class CreateSellerRequest(
    @field:NotBlank(message = "Nome da loja é obrigatório.")
    @field:Size(min = 2, max = 160)
    val storeName: String,

    @field:Size(max = 2000)
    val description: String?,

    @field:NotNull(message = "Tipo de vendedor é obrigatório.")
    val type: SellerType,
)

data class UpdateSellerRequest(
    @field:NotBlank(message = "Nome da loja é obrigatório.")
    @field:Size(min = 2, max = 160)
    val storeName: String,

    @field:Size(max = 2000)
    val description: String?,

    @field:NotNull(message = "Tipo de vendedor é obrigatório.")
    val type: SellerType,
)

data class SellerDashboardResponse(
    val activeListings: Long,
    val pendingListings: Long,
    val soldOutListings: Long,
    val ordersOpen: Long,
    val salesLast30Days: Long,
    val revenueLast30Days: BigDecimal,
    val averageRating: BigDecimal,
)

data class SellerReputationResponse(
    val sellerId: UUID,
    val averageRating: BigDecimal,
    val totalReviews: Long,
)

fun SellerProfile.toResponse() = SellerProfileResponse(
    id = id,
    userId = user.id,
    storeName = storeName,
    description = description,
    type = type,
    rating = rating,
    status = status,
)
