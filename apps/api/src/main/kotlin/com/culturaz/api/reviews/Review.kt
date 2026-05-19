package com.culturaz.api.reviews

import com.culturaz.api.orders.Order
import com.culturaz.api.sellers.SellerProfile
import com.culturaz.api.users.User
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.ForeignKey
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint
import java.time.Instant
import java.util.UUID

@Entity
@Table(
    name = "reviews",
    uniqueConstraints = [UniqueConstraint(
        name = "uq_reviews_order_reviewer_seller",
        columnNames = ["order_id", "reviewer_id", "seller_id"],
    )],
)
class Review(
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    var id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false, foreignKey = ForeignKey(name = "fk_reviews_order"))
    var order: Order,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reviewer_id", nullable = false, foreignKey = ForeignKey(name = "fk_reviews_reviewer"))
    var reviewer: User,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seller_id", nullable = false, foreignKey = ForeignKey(name = "fk_reviews_seller"))
    var seller: SellerProfile,

    @Column(name = "rating", nullable = false)
    var rating: Int,

    @Column(name = "comment", columnDefinition = "TEXT")
    var comment: String? = null,

    @Column(name = "tags", columnDefinition = "TEXT")
    var tags: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.now(),
)
