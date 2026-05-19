package com.culturaz.api.favorites

import com.culturaz.api.listings.BookListing
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
    name = "favorites",
    uniqueConstraints = [UniqueConstraint(name = "uq_favorites_user_listing", columnNames = ["user_id", "listing_id"])],
)
class Favorite(
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    var id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = ForeignKey(name = "fk_favorites_user"))
    var user: User,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "listing_id", nullable = false, foreignKey = ForeignKey(name = "fk_favorites_listing"))
    var listing: BookListing,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.now(),
)
