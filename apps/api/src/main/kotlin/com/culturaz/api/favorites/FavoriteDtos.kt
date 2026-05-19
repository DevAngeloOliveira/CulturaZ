package com.culturaz.api.favorites

import com.culturaz.api.listings.ListingResponse
import com.culturaz.api.listings.toResponse
import java.time.Instant
import java.util.UUID

data class FavoriteResponse(
    val id: UUID,
    val listing: ListingResponse,
    val createdAt: Instant,
)

fun Favorite.toResponse() = FavoriteResponse(
    id = id,
    listing = listing.toResponse(),
    createdAt = createdAt,
)
