package com.culturaz.api.orders

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

@Repository
interface OrderRepository : JpaRepository<Order, UUID> {

    fun findByBuyerIdOrderByCreatedAtDesc(buyerId: UUID, pageable: Pageable): Page<Order>
    fun findByIdAndBuyerId(id: UUID, buyerId: UUID): Order?
    fun countByCreatedAtAfter(after: Instant): Long

    @Query(
        """
        select o from Order o
        where exists (select 1 from OrderItem oi where oi.order = o and oi.seller.id = :sellerId)
        """,
    )
    fun findOrdersBySeller(@Param("sellerId") sellerId: UUID, pageable: Pageable): Page<Order>

    @Query(
        """
        select count(o) from Order o
        where o.status in :statuses
          and exists (select 1 from OrderItem oi where oi.order = o and oi.seller.id = :sellerId)
        """,
    )
    fun countOrdersBySellerAndStatusIn(
        @Param("sellerId") sellerId: UUID,
        @Param("statuses") statuses: Collection<OrderStatus>,
    ): Long

    @Query(
        """
        select coalesce(sum(o.totalAmount), 0)
        from Order o
        where o.createdAt >= :since
          and o.status not in (com.culturaz.api.orders.OrderStatus.CANCELLED, com.culturaz.api.orders.OrderStatus.REFUNDED)
        """,
    )
    fun gmvSince(@Param("since") since: Instant): BigDecimal
}

@Repository
interface OrderItemRepository : JpaRepository<OrderItem, UUID> {
    fun findByOrderId(orderId: UUID): List<OrderItem>
    fun findBySellerIdOrderByCreatedAtDesc(sellerId: UUID, pageable: Pageable): Page<OrderItem>

    @Query(
        """
        select count(distinct oi.order.id)
        from OrderItem oi
        where oi.seller.id = :sellerId
          and oi.order.createdAt >= :since
          and oi.order.status not in (com.culturaz.api.orders.OrderStatus.CANCELLED, com.culturaz.api.orders.OrderStatus.REFUNDED)
        """,
    )
    fun countDistinctOrdersBySellerSince(@Param("sellerId") sellerId: UUID, @Param("since") since: Instant): Long

    @Query(
        """
        select coalesce(sum(oi.subtotal), 0)
        from OrderItem oi
        where oi.seller.id = :sellerId
          and oi.order.createdAt >= :since
          and oi.order.status not in (com.culturaz.api.orders.OrderStatus.CANCELLED, com.culturaz.api.orders.OrderStatus.REFUNDED)
        """,
    )
    fun revenueBySellerSince(@Param("sellerId") sellerId: UUID, @Param("since") since: Instant): BigDecimal

    fun existsByOrderIdAndSellerId(orderId: UUID, sellerId: UUID): Boolean
}
