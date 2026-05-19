package com.culturaz.api.listings

import com.culturaz.api.shared.exceptions.InvalidStateTransitionException

object ListingStateMachine {

    private val sellerTransitions: Map<ListingStatus, Set<ListingStatus>> = mapOf(
        ListingStatus.PENDING_REVIEW to emptySet(),
        ListingStatus.ACTIVE to setOf(ListingStatus.PAUSED, ListingStatus.REMOVED),
        ListingStatus.PAUSED to setOf(ListingStatus.ACTIVE, ListingStatus.REMOVED),
        ListingStatus.SOLD_OUT to setOf(ListingStatus.ACTIVE, ListingStatus.PAUSED, ListingStatus.REMOVED),
        ListingStatus.BLOCKED to emptySet(),
        ListingStatus.REMOVED to emptySet(),
    )

    private val adminTransitions: Map<ListingStatus, Set<ListingStatus>> = mapOf(
        ListingStatus.PENDING_REVIEW to setOf(ListingStatus.ACTIVE, ListingStatus.SOLD_OUT, ListingStatus.BLOCKED),
        ListingStatus.ACTIVE to setOf(ListingStatus.BLOCKED),
        ListingStatus.PAUSED to setOf(ListingStatus.BLOCKED),
        ListingStatus.SOLD_OUT to setOf(ListingStatus.BLOCKED),
        ListingStatus.BLOCKED to setOf(ListingStatus.ACTIVE),
        ListingStatus.REMOVED to emptySet(),
    )

    fun assertSellerTransition(from: ListingStatus, to: ListingStatus) {
        if (to !in (sellerTransitions[from] ?: emptySet())) {
            throw InvalidStateTransitionException.of(from, to)
        }
    }

    fun assertAdminTransition(from: ListingStatus, to: ListingStatus) {
        if (to !in (adminTransitions[from] ?: emptySet())) {
            throw InvalidStateTransitionException.of(from, to)
        }
    }
}
