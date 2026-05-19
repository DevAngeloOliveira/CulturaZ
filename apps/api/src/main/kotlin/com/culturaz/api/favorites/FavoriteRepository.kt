package com.culturaz.api.favorites

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface FavoriteRepository : JpaRepository<Favorite, UUID> {
    fun findByUserIdOrderByCreatedAtDesc(userId: UUID): List<Favorite>
    fun findByUserIdAndListingId(userId: UUID, listingId: UUID): Favorite?
    fun existsByUserIdAndListingId(userId: UUID, listingId: UUID): Boolean
}
