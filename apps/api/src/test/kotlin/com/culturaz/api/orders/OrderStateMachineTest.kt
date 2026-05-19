package com.culturaz.api.orders

import com.culturaz.api.shared.exceptions.InvalidStateTransitionException
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test

class OrderStateMachineTest {

    @Test
    fun `seller can move confirmed to in preparation`() {
        OrderStateMachine.assertSellerTransition(OrderStatus.CONFIRMED, OrderStatus.IN_PREPARATION)
    }

    @Test
    fun `seller can move shipped to delivered`() {
        OrderStateMachine.assertSellerTransition(OrderStatus.SHIPPED, OrderStatus.DELIVERED)
    }

    @Test
    fun `seller cannot move delivered to anything`() {
        assertThrows(InvalidStateTransitionException::class.java) {
            OrderStateMachine.assertSellerTransition(OrderStatus.DELIVERED, OrderStatus.IN_PREPARATION)
        }
    }

    @Test
    fun `buyer can cancel created order`() {
        OrderStateMachine.assertCancelable(OrderStatus.CREATED)
        OrderStateMachine.assertCancelable(OrderStatus.CONFIRMED)
    }

    @Test
    fun `buyer cannot cancel shipped order`() {
        assertThrows(InvalidStateTransitionException::class.java) {
            OrderStateMachine.assertCancelable(OrderStatus.SHIPPED)
        }
    }

    @Test
    fun `buyer cannot cancel delivered order`() {
        assertThrows(InvalidStateTransitionException::class.java) {
            OrderStateMachine.assertCancelable(OrderStatus.DELIVERED)
        }
    }
}
