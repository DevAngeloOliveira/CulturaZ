package com.culturaz.api.orders

import com.culturaz.api.admin.AuditAction
import com.culturaz.api.admin.AuditLogService
import com.culturaz.api.cart.CartRepository
import com.culturaz.api.listings.ListingService
import com.culturaz.api.sellers.SellerService
import com.culturaz.api.shared.exceptions.ConflictException
import com.culturaz.api.shared.exceptions.ForbiddenException
import com.culturaz.api.shared.exceptions.NotFoundException
import com.culturaz.api.users.AddressService
import com.culturaz.api.users.UserRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

@Service
class OrderService(
    private val orderRepository: OrderRepository,
    private val orderItemRepository: OrderItemRepository,
    private val cartRepository: CartRepository,
    private val userRepository: UserRepository,
    private val addressService: AddressService,
    private val listingService: ListingService,
    private val sellerService: SellerService,
    private val auditLogService: AuditLogService,
    private val orderCodeGenerator: OrderCodeGenerator,
) {

    @Transactional
    fun checkout(userId: UUID, request: CreateOrderRequest): Order {
        val cart = cartRepository.findByUserId(userId)
            ?: throw ConflictException("CART_EMPTY", "Carrinho está vazio.")
        if (cart.items.isEmpty()) {
            throw ConflictException("CART_EMPTY", "Carrinho está vazio.")
        }

        val buyer = userRepository.findById(userId).orElseThrow { NotFoundException.of("Usuário", userId) }
        val address = addressService.getForUser(userId, request.shippingAddressId)

        val order = Order(
            code = orderCodeGenerator.next(),
            buyer = buyer,
            status = OrderStatus.CONFIRMED,
            paymentStatus = PaymentStatus.SIMULATED,
            subtotalAmount = BigDecimal.ZERO,
            shippingAmount = BigDecimal.ZERO,
            totalAmount = BigDecimal.ZERO,
            shippingAddress = address,
        )

        var subtotal = BigDecimal.ZERO
        val itemsSnapshot = cart.items.toList()
        for (cartItem in itemsSnapshot) {
            val listing = cartItem.listing
            listingService.requireActiveForPurchase(listing)
            if (listing.stockQuantity < cartItem.quantity) {
                throw ConflictException(
                    "INSUFFICIENT_STOCK",
                    "Estoque insuficiente para '${listing.book.title}'.",
                )
            }
            val unitPrice = listing.price
            val itemSubtotal = unitPrice.multiply(BigDecimal(cartItem.quantity))
            subtotal = subtotal.add(itemSubtotal)
            val orderItem = OrderItem(
                order = order,
                listing = listing,
                seller = listing.seller,
                bookTitle = listing.book.title,
                quantity = cartItem.quantity,
                unitPrice = unitPrice,
                subtotal = itemSubtotal,
            )
            order.items.add(orderItem)
            listingService.decrementStock(listing, cartItem.quantity)
        }
        order.subtotalAmount = subtotal
        order.totalAmount = subtotal.add(order.shippingAmount)

        val saved = orderRepository.save(order)
        cart.items.clear()
        cart.updatedAt = Instant.now()

        auditLogService.record(
            action = AuditAction.ORDER_CREATED,
            actorUserId = userId,
            resourceType = "Order",
            resourceId = saved.id,
            metadata = mapOf("code" to saved.code, "total" to saved.totalAmount.toPlainString()),
        )
        return saved
    }

    @Transactional(readOnly = true)
    fun listForBuyer(buyerId: UUID, pageable: Pageable): Page<Order> =
        orderRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId, pageable)

    @Transactional(readOnly = true)
    fun getForBuyer(buyerId: UUID, orderId: UUID): Order {
        return orderRepository.findByIdAndBuyerId(orderId, buyerId)
            ?: throw NotFoundException("ORDER_NOT_FOUND", "Pedido não encontrado.")
    }

    @Transactional
    fun cancelByBuyer(buyerId: UUID, orderId: UUID, request: CancelOrderRequest): Order {
        val order = getForBuyer(buyerId, orderId)
        if (order.status !in setOf(OrderStatus.CREATED, OrderStatus.WAITING_PAYMENT, OrderStatus.CONFIRMED)) {
            throw ConflictException("ORDER_NOT_CANCELABLE", "Pedido neste status não pode ser cancelado.")
        }
        OrderStateMachine.assertCancelable(order.status)
        order.status = OrderStatus.CANCELLED
        order.paymentStatus = PaymentStatus.CANCELLED
        order.updatedAt = Instant.now()
        for (item in order.items) {
            listingService.returnStock(item.listing, item.quantity)
        }
        auditLogService.record(
            action = AuditAction.ORDER_CANCELLED,
            actorUserId = buyerId,
            resourceType = "Order",
            resourceId = order.id,
            metadata = request.reason?.let { mapOf("reason" to it) },
        )
        return order
    }

    @Transactional(readOnly = true)
    fun listForSellerUser(userId: UUID, pageable: Pageable): Page<Order> {
        val seller = sellerService.getByUserId(userId)
        return orderRepository.findOrdersBySeller(seller.id, pageable)
    }

    @Transactional(readOnly = true)
    fun getForSellerUser(userId: UUID, orderId: UUID): Order {
        val seller = sellerService.getByUserId(userId)
        if (!orderItemRepository.existsByOrderIdAndSellerId(orderId, seller.id)) {
            throw ForbiddenException(message = "Você não tem acesso a este pedido.")
        }
        return orderRepository.findById(orderId).orElseThrow {
            NotFoundException("ORDER_NOT_FOUND", "Pedido não encontrado.")
        }
    }

    @Transactional
    fun updateStatusBySellerUser(userId: UUID, orderId: UUID, target: OrderStatus): Order {
        val order = getForSellerUser(userId, orderId)
        OrderStateMachine.assertSellerTransition(order.status, target)
        order.status = target
        order.updatedAt = Instant.now()
        auditLogService.record(
            action = AuditAction.ORDER_STATUS_UPDATED,
            actorUserId = userId,
            resourceType = "Order",
            resourceId = order.id,
            metadata = mapOf("status" to target.name),
        )
        return order
    }

    @Transactional(readOnly = true)
    fun listAll(pageable: Pageable): Page<Order> = orderRepository.findAll(pageable)

    @Transactional(readOnly = true)
    fun getById(id: UUID): Order = orderRepository.findById(id).orElseThrow {
        NotFoundException("ORDER_NOT_FOUND", "Pedido não encontrado.")
    }
}
