package com.culturaz.api.users

enum class UserStatus {
    ACTIVE,
    BLOCKED,
    PENDING_VERIFICATION,
    DELETED,
}

enum class UserRole {
    CUSTOMER,
    SELLER,
    ADMIN,
    SUPPORT,
}
