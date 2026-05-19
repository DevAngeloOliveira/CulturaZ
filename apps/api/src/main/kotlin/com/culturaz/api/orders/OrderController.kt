package com.culturaz.api.orders

import com.culturaz.api.shared.responses.PagedResponse
import com.culturaz.api.shared.security.requireAuthUser
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/orders")
@SecurityRequirement(name = "bearerAuth")
class BuyerOrderController(private val orderService: OrderService) {

    @PostMapping
    fun create(@Valid @RequestBody request: CreateOrderRequest): ResponseEntity<OrderResponse> {
        val auth = requireAuthUser()
        val order = orderService.checkout(auth.id, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(order.toResponse())
    }

    @GetMapping("/me")
    fun listMine(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
    ): PagedResponse<OrderResponse> {
        val auth = requireAuthUser()
        val pageable = PageRequest.of(
            page.coerceAtLeast(0),
            size.coerceIn(1, 100),
            Sort.by(Sort.Direction.DESC, "createdAt"),
        )
        return PagedResponse.from(orderService.listForBuyer(auth.id, pageable)) { it.toResponse() }
    }

    @GetMapping("/{id}")
    fun getMine(@PathVariable id: UUID): OrderResponse {
        val auth = requireAuthUser()
        return orderService.getForBuyer(auth.id, id).toResponse()
    }

    @PatchMapping("/{id}/cancel")
    fun cancel(
        @PathVariable id: UUID,
        @RequestBody(required = false) body: CancelOrderRequest?,
    ): OrderResponse {
        val auth = requireAuthUser()
        return orderService.cancelByBuyer(auth.id, id, body ?: CancelOrderRequest()).toResponse()
    }
}

@RestController
@RequestMapping("/api/seller/orders")
@SecurityRequirement(name = "bearerAuth")
class SellerOrderController(private val orderService: OrderService) {

    @GetMapping
    fun listMine(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
    ): PagedResponse<OrderResponse> {
        val auth = requireAuthUser()
        val pageable = PageRequest.of(
            page.coerceAtLeast(0),
            size.coerceIn(1, 100),
            Sort.by(Sort.Direction.DESC, "createdAt"),
        )
        return PagedResponse.from(orderService.listForSellerUser(auth.id, pageable)) { it.toResponse() }
    }

    @GetMapping("/{id}")
    fun getOne(@PathVariable id: UUID): OrderResponse {
        val auth = requireAuthUser()
        return orderService.getForSellerUser(auth.id, id).toResponse()
    }

    @PatchMapping("/{id}/status")
    fun updateStatus(
        @PathVariable id: UUID,
        @Valid @RequestBody request: UpdateOrderStatusRequest,
    ): OrderResponse {
        val auth = requireAuthUser()
        return orderService.updateStatusBySellerUser(auth.id, id, request.status).toResponse()
    }
}

@RestController
@RequestMapping("/api/admin/orders")
@SecurityRequirement(name = "bearerAuth")
class AdminOrderController(private val orderService: OrderService) {

    @GetMapping
    fun list(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
    ): PagedResponse<OrderResponse> {
        val pageable = PageRequest.of(
            page.coerceAtLeast(0),
            size.coerceIn(1, 100),
            Sort.by(Sort.Direction.DESC, "createdAt"),
        )
        return PagedResponse.from(orderService.listAll(pageable)) { it.toResponse() }
    }

    @GetMapping("/{id}")
    fun getOne(@PathVariable id: UUID): OrderResponse =
        orderService.getById(id).toResponse()
}
