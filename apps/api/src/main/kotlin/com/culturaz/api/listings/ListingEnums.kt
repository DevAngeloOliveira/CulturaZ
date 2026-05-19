package com.culturaz.api.listings

enum class BookCondition {
    NEW,
    LIKE_NEW,
    GOOD,
    FAIR,
    DAMAGED,
}

enum class ListingStatus {
    PENDING_REVIEW,
    ACTIVE,
    PAUSED,
    BLOCKED,
    SOLD_OUT,
    REMOVED,
}
