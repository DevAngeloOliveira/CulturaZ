package com.culturaz.api.orders

import com.culturaz.api.shared.exceptions.InvalidStateTransitionException

object OrderStateMachine {

    private val sellerTransitions: Map<OrderStatus, Set<OrderStatus>> = mapOf(
        OrderStatus.CONFIRMED to setOf(OrderStatus.IN_PREPARATION),
        OrderStatus.IN_PREPARATION to setOf(OrderStatus.SHIPPED),
        OrderStatus.SHIPPED to setOf(OrderStatus.DELIVERED),
    )

    private val cancelableByBuyer: Set<OrderStatus> = setOf(
        OrderStatus.CREATED,
        OrderStatus.WAITING_PAYMENT,
        OrderStatus.CONFIRMED,
    )

    fun assertSellerTransition(from: OrderStatus, to: OrderStatus) {
        if (to !in (sellerTransitions[from] ?: emptySet())) {
            throw InvalidStateTransitionException.of(from, to)
        }
    }

    fun assertCancelable(from: OrderStatus) {
        if (from !in cancelableByBuyer) {
            throw InvalidStateTransitionException("Pedido em status $from não pode ser cancelado.")
        }
    }
}
