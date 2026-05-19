package com.culturaz.api.favorites

import com.culturaz.api.listings.ListingService
import com.culturaz.api.listings.ListingStatus
import com.culturaz.api.shared.exceptions.ConflictException
import com.culturaz.api.shared.exceptions.NotFoundException
import com.culturaz.api.users.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class FavoriteService(
    private val repository: FavoriteRepository,
    private val userRepository: UserRepository,
    private val listingService: ListingService,
) {

    @Transactional(readOnly = true)
    fun listByUser(userId: UUID): List<Favorite> =
        repository.findByUserIdOrderByCreatedAtDesc(userId)

    @Transactional
    fun add(userId: UUID, listingId: UUID): Favorite {
        if (repository.existsByUserIdAndListingId(userId, listingId)) {
            throw ConflictException("FAVORITE_ALREADY_EXISTS", "Anúncio já está nos seus favoritos.")
        }
        val listing = listingService.getByIdRaw(listingId)
        if (listing.status == ListingStatus.REMOVED || listing.status == ListingStatus.BLOCKED) {
            throw ConflictException("LISTING_NOT_ACTIVE", "Este anúncio não pode ser favoritado.")
        }
        val user = userRepository.findById(userId).orElseThrow {
            NotFoundException.of("Usuário", userId)
        }
        val favorite = Favorite(user = user, listing = listing)
        return repository.save(favorite)
    }

    @Transactional
    fun remove(userId: UUID, listingId: UUID) {
        val favorite = repository.findByUserIdAndListingId(userId, listingId) ?: return
        repository.delete(favorite)
    }
}
