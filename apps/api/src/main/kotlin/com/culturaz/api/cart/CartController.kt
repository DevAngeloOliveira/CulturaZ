package com.culturaz.api.cart

import com.culturaz.api.shared.security.requireAuthUser
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/cart")
@SecurityRequirement(name = "bearerAuth")
class CartController(private val cartService: CartService) {

    @GetMapping
    fun current(): CartResponse {
        val auth = requireAuthUser()
        return cartService.getCurrent(auth.id).toResponse()
    }

    @PostMapping("/items")
    fun addItem(@Valid @RequestBody request: AddCartItemRequest): ResponseEntity<CartResponse> {
        val auth = requireAuthUser()
        val cart = cartService.addItem(auth.id, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(cart.toResponse())
    }

    @PutMapping("/items/{id}")
    fun updateItem(
        @PathVariable id: UUID,
        @Valid @RequestBody request: UpdateCartItemRequest,
    ): CartResponse {
        val auth = requireAuthUser()
        return cartService.updateItem(auth.id, id, request).toResponse()
    }

    @DeleteMapping("/items/{id}")
    fun removeItem(@PathVariable id: UUID): CartResponse {
        val auth = requireAuthUser()
        return cartService.removeItem(auth.id, id).toResponse()
    }

    @DeleteMapping
    fun clear(): ResponseEntity<Void> {
        val auth = requireAuthUser()
        cartService.clear(auth.id)
        return ResponseEntity.noContent().build()
    }
}
