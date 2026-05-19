package com.culturaz.api.listings

import com.culturaz.api.shared.exceptions.InvalidStateTransitionException
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test

class ListingStateMachineTest {

    @Test
    fun `seller can pause active listing`() {
        ListingStateMachine.assertSellerTransition(ListingStatus.ACTIVE, ListingStatus.PAUSED)
    }

    @Test
    fun `seller cannot transition pending review directly to active`() {
        assertThrows(InvalidStateTransitionException::class.java) {
            ListingStateMachine.assertSellerTransition(ListingStatus.PENDING_REVIEW, ListingStatus.ACTIVE)
        }
    }

    @Test
    fun `admin can approve pending listing to active`() {
        ListingStateMachine.assertAdminTransition(ListingStatus.PENDING_REVIEW, ListingStatus.ACTIVE)
    }

    @Test
    fun `admin can block active listing`() {
        ListingStateMachine.assertAdminTransition(ListingStatus.ACTIVE, ListingStatus.BLOCKED)
    }

    @Test
    fun `cannot transition removed listing back`() {
        assertThrows(InvalidStateTransitionException::class.java) {
            ListingStateMachine.assertSellerTransition(ListingStatus.REMOVED, ListingStatus.ACTIVE)
        }
        assertThrows(InvalidStateTransitionException::class.java) {
            ListingStateMachine.assertAdminTransition(ListingStatus.REMOVED, ListingStatus.ACTIVE)
        }
    }
}
