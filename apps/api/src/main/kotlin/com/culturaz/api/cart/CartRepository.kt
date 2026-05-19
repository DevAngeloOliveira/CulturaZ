package com.culturaz.api.cart

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface CartRepository : JpaRepository<Cart, UUID> {
    fun findByUserId(userId: UUID): Cart?
}

@Repository
interface CartItemRepository : JpaRepository<CartItem, UUID> {
    fun findByCartIdAndListingId(cartId: UUID, listingId: UUID): CartItem?
    fun findByCartId(cartId: UUID): List<CartItem>
    fun deleteByCartId(cartId: UUID)
}
