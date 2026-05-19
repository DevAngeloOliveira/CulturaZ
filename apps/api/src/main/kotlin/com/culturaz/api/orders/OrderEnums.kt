package com.culturaz.api.orders

enum class OrderStatus {
    CREATED,
    WAITING_PAYMENT,
    CONFIRMED,
    IN_PREPARATION,
    SHIPPED,
    DELIVERED,
    CANCELLED,
    REFUNDED,
}

enum class PaymentStatus {
    SIMULATED,
    PENDING,
    APPROVED,
    REJECTED,
    REFUNDED,
    CANCELLED,
}
