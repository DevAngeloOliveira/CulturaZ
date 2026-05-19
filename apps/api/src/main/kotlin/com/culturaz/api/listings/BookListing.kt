package com.culturaz.api.listings

import com.culturaz.api.books.Book
import com.culturaz.api.sellers.SellerProfile
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
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
@Table(name = "book_listings")
class BookListing(
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    var id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "book_id", nullable = false, foreignKey = ForeignKey(name = "fk_book_listings_book"))
    var book: Book,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seller_id", nullable = false, foreignKey = ForeignKey(name = "fk_book_listings_seller"))
    var seller: SellerProfile,

    @Column(name = "price", nullable = false, precision = 12, scale = 2)
    var price: BigDecimal,

    @Column(name = "original_price", precision = 12, scale = 2)
    var originalPrice: BigDecimal? = null,

    @Column(name = "stock_quantity", nullable = false)
    var stockQuantity: Int = 0,

    @Enumerated(EnumType.STRING)
    @Column(name = "condition", nullable = false, length = 20)
    var condition: BookCondition,

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    var status: ListingStatus = ListingStatus.PENDING_REVIEW,

    @Column(name = "cover_image_url", length = 500)
    var coverImageUrl: String? = null,

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    var description: String,

    @Column(name = "city", length = 120)
    var city: String? = null,

    @Column(name = "state", length = 2)
    var state: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now(),
)
