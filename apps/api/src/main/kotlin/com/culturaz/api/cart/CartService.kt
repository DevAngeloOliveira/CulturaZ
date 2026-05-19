package com.culturaz.api.cart

import com.culturaz.api.listings.ListingService
import com.culturaz.api.shared.exceptions.ConflictException
import com.culturaz.api.shared.exceptions.NotFoundException
import com.culturaz.api.users.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

@Service
class CartService(
    private val cartRepository: CartRepository,
    private val cartItemRepository: CartItemRepository,
    private val userRepository: UserRepository,
    private val listingService: ListingService,
) {

    @Transactional
    fun getOrCreate(userId: UUID): Cart {
        val existing = cartRepository.findByUserId(userId)
        if (existing != null) return existing
        val user = userRepository.findById(userId).orElseThrow { NotFoundException.of("Usuário", userId) }
        return cartRepository.save(Cart(user = user))
    }

    @Transactional(readOnly = true)
    fun getCurrent(userId: UUID): Cart = cartRepository.findByUserId(userId) ?: Cart(
        user = userRepository.findById(userId).orElseThrow { NotFoundException.of("Usuário", userId) },
    )

    @Transactional
    fun addItem(userId: UUID, request: AddCartItemRequest): Cart {
        val cart = getOrCreate(userId)
        val listing = listingService.getByIdRaw(request.listingId)
        listingService.requireActiveForPurchase(listing)
        val existing = cartItemRepository.findByCartIdAndListingId(cart.id, listing.id)
        val newQuantity = (existing?.quantity ?: 0) + request.quantity
        if (newQuantity > listing.stockQuantity) {
            throw ConflictException(
                "INSUFFICIENT_STOCK",
                "Estoque insuficiente para a quantidade solicitada.",
            )
        }
        if (existing != null) {
            existing.quantity = newQuantity
            existing.unitPrice = listing.price
            existing.updatedAt = Instant.now()
        } else {
            val item = CartItem(
                cart = cart,
                listing = listing,
                quantity = request.quantity,
                unitPrice = listing.price,
            )
            val savedItem = cartItemRepository.save(item)
            cart.items.add(savedItem)
        }
        cart.updatedAt = Instant.now()
        return cart
    }

    @Transactional
    fun updateItem(userId: UUID, itemId: UUID, request: UpdateCartItemRequest): Cart {
        val cart = cartRepository.findByUserId(userId)
            ?: throw NotFoundException("CART_NOT_FOUND", "Carrinho não encontrado.")
        val item = cart.items.firstOrNull { it.id == itemId }
            ?: throw NotFoundException("CART_ITEM_NOT_FOUND", "Item do carrinho não encontrado.")
        if (request.quantity > item.listing.stockQuantity) {
            throw ConflictException("INSUFFICIENT_STOCK", "Estoque insuficiente para a quantidade solicitada.")
        }
        item.quantity = request.quantity
        item.unitPrice = item.listing.price
        item.updatedAt = Instant.now()
        cart.updatedAt = Instant.now()
        return cart
    }

    @Transactional
    fun removeItem(userId: UUID, itemId: UUID): Cart {
        val cart = cartRepository.findByUserId(userId)
            ?: throw NotFoundException("CART_NOT_FOUND", "Carrinho não encontrado.")
        val item = cart.items.firstOrNull { it.id == itemId }
            ?: throw NotFoundException("CART_ITEM_NOT_FOUND", "Item do carrinho não encontrado.")
        cart.items.remove(item)
        cart.updatedAt = Instant.now()
        return cart
    }

    @Transactional
    fun clear(userId: UUID): Cart {
        val cart = cartRepository.findByUserId(userId) ?: return getOrCreate(userId)
        cart.items.clear()
        cart.updatedAt = Instant.now()
        return cart
    }
}
