package com.culturaz.api.orders

import com.culturaz.api.listings.BookListing
import com.culturaz.api.sellers.SellerProfile
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.ForeignKey
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "order_items")
class OrderItem(
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    var id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false, foreignKey = ForeignKey(name = "fk_order_items_order"))
    var order: Order,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "listing_id", nullable = false, foreignKey = ForeignKey(name = "fk_order_items_listing"))
    var listing: BookListing,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seller_id", nullable = false, foreignKey = ForeignKey(name = "fk_order_items_seller"))
    var seller: SellerProfile,

    @Column(name = "book_title", nullable = false, length = 255)
    var bookTitle: String,

    @Column(name = "quantity", nullable = false)
    var quantity: Int,

    @Column(name = "unit_price", nullable = false, precision = 12, scale = 2)
    var unitPrice: BigDecimal,

    @Column(name = "subtotal", nullable = false, precision = 12, scale = 2)
    var subtotal: BigDecimal,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.now(),
)
