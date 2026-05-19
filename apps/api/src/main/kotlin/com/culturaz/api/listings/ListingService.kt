package com.culturaz.api.listings

import com.culturaz.api.admin.AuditAction
import com.culturaz.api.admin.AuditLogService
import com.culturaz.api.books.Book
import com.culturaz.api.books.BookService
import com.culturaz.api.sellers.SellerService
import com.culturaz.api.shared.exceptions.ConflictException
import com.culturaz.api.shared.exceptions.ForbiddenException
import com.culturaz.api.shared.exceptions.NotFoundException
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

@Service
class ListingService(
    private val repository: BookListingRepository,
    private val bookService: BookService,
    private val sellerService: SellerService,
    private val auditLogService: AuditLogService,
) {

    @Transactional(readOnly = true)
    fun searchActive(
        q: String?,
        categoryId: UUID?,
        condition: BookCondition?,
        priceMin: BigDecimal?,
        priceMax: BigDecimal?,
        city: String?,
        state: String?,
        pageable: Pageable,
    ): Page<BookListing> = repository.searchActive(
        activeStatus = ListingStatus.ACTIVE,
        q = q?.trim().orEmpty(),
        categoryId = categoryId,
        condition = condition,
        priceMin = priceMin,
        priceMax = priceMax,
        city = city?.trim().orEmpty(),
        state = state?.trim().orEmpty(),
        pageable = pageable,
    )

    @Transactional(readOnly = true)
    fun getPublicById(id: UUID): BookListing {
        val listing = repository.findById(id).orElseThrow {
            NotFoundException("LISTING_NOT_FOUND", "Anúncio não encontrado.")
        }
        if (listing.status !in setOf(ListingStatus.ACTIVE, ListingStatus.SOLD_OUT)) {
            throw NotFoundException("LISTING_NOT_FOUND", "Anúncio não encontrado.")
        }
        return listing
    }

    @Transactional(readOnly = true)
    fun getByIdRaw(id: UUID): BookListing = repository.findById(id).orElseThrow {
        NotFoundException("LISTING_NOT_FOUND", "Anúncio não encontrado.")
    }

    @Transactional(readOnly = true)
    fun listForSeller(userId: UUID, pageable: Pageable): Page<BookListing> {
        val seller = sellerService.getByUserId(userId)
        return repository.findBySellerId(seller.id, pageable)
    }

    @Transactional
    fun createForUser(userId: UUID, request: CreateListingRequest): BookListing {
        val seller = sellerService.requireActiveSeller(userId)
        val book: Book = bookService.getById(request.bookId)
        val initialStatus = ListingStatus.PENDING_REVIEW
        val listing = BookListing(
            book = book,
            seller = seller,
            price = request.price,
            originalPrice = request.originalPrice,
            stockQuantity = request.stockQuantity,
            condition = request.condition,
            status = initialStatus,
            coverImageUrl = request.coverImageUrl?.takeIf { it.isNotBlank() },
            description = request.description.trim(),
            city = request.city?.takeIf { it.isNotBlank() },
            state = request.state?.takeIf { it.isNotBlank() }?.uppercase(),
        )
        val saved = repository.save(listing)
        auditLogService.record(
            action = AuditAction.LISTING_CREATED,
            actorUserId = userId,
            resourceType = "BookListing",
            resourceId = saved.id,
        )
        return saved
    }

    @Transactional
    fun updateOwnedBy(userId: UUID, listingId: UUID, request: UpdateListingRequest): BookListing {
        val listing = getOwnedByOrThrow(userId, listingId)
        if (listing.status == ListingStatus.REMOVED || listing.status == ListingStatus.BLOCKED) {
            throw ConflictException("LISTING_NOT_EDITABLE", "Anúncio neste status não pode ser editado.")
        }
        listing.price = request.price
        listing.originalPrice = request.originalPrice
        listing.stockQuantity = request.stockQuantity
        listing.condition = request.condition
        listing.description = request.description.trim()
        listing.coverImageUrl = request.coverImageUrl?.takeIf { it.isNotBlank() }
        listing.city = request.city?.takeIf { it.isNotBlank() }
        listing.state = request.state?.takeIf { it.isNotBlank() }?.uppercase()
        if (listing.status == ListingStatus.ACTIVE && listing.stockQuantity == 0) {
            listing.status = ListingStatus.SOLD_OUT
        } else if (listing.status == ListingStatus.SOLD_OUT && listing.stockQuantity > 0) {
            listing.status = ListingStatus.ACTIVE
        }
        listing.updatedAt = Instant.now()
        return listing
    }

    @Transactional
    fun pauseOwnedBy(userId: UUID, listingId: UUID): BookListing {
        val listing = getOwnedByOrThrow(userId, listingId)
        ListingStateMachine.assertSellerTransition(listing.status, ListingStatus.PAUSED)
        listing.status = ListingStatus.PAUSED
        listing.updatedAt = Instant.now()
        auditLogService.record(
            action = AuditAction.LISTING_PAUSED,
            actorUserId = userId,
            resourceType = "BookListing",
            resourceId = listing.id,
        )
        return listing
    }

    @Transactional
    fun activateOwnedBy(userId: UUID, listingId: UUID): BookListing {
        val listing = getOwnedByOrThrow(userId, listingId)
        ListingStateMachine.assertSellerTransition(listing.status, ListingStatus.ACTIVE)
        if (listing.stockQuantity <= 0) {
            throw ConflictException("INSUFFICIENT_STOCK", "Não é possível ativar um anúncio sem estoque.")
        }
        listing.status = ListingStatus.ACTIVE
        listing.updatedAt = Instant.now()
        auditLogService.record(
            action = AuditAction.LISTING_ACTIVATED,
            actorUserId = userId,
            resourceType = "BookListing",
            resourceId = listing.id,
        )
        return listing
    }

    @Transactional
    fun removeOwnedBy(userId: UUID, listingId: UUID) {
        val listing = getOwnedByOrThrow(userId, listingId)
        ListingStateMachine.assertSellerTransition(listing.status, ListingStatus.REMOVED)
        listing.status = ListingStatus.REMOVED
        listing.updatedAt = Instant.now()
        auditLogService.record(
            action = AuditAction.LISTING_REMOVED,
            actorUserId = userId,
            resourceType = "BookListing",
            resourceId = listing.id,
        )
    }

    @Transactional
    fun approveAsAdmin(actorUserId: UUID, listingId: UUID): BookListing {
        val listing = getByIdRaw(listingId)
        val target = if (listing.stockQuantity > 0) ListingStatus.ACTIVE else ListingStatus.SOLD_OUT
        ListingStateMachine.assertAdminTransition(listing.status, target)
        listing.status = target
        listing.updatedAt = Instant.now()
        auditLogService.record(
            action = AuditAction.LISTING_APPROVED,
            actorUserId = actorUserId,
            resourceType = "BookListing",
            resourceId = listing.id,
            metadata = mapOf("targetStatus" to target.name),
        )
        return listing
    }

    @Transactional
    fun blockAsAdmin(actorUserId: UUID, listingId: UUID, reason: String?): BookListing {
        val listing = getByIdRaw(listingId)
        ListingStateMachine.assertAdminTransition(listing.status, ListingStatus.BLOCKED)
        listing.status = ListingStatus.BLOCKED
        listing.updatedAt = Instant.now()
        auditLogService.record(
            action = AuditAction.LISTING_BLOCKED,
            actorUserId = actorUserId,
            resourceType = "BookListing",
            resourceId = listing.id,
            metadata = reason?.let { mapOf("reason" to it) },
        )
        return listing
    }

    @Transactional(readOnly = true)
    fun listByStatusForAdmin(status: ListingStatus?, pageable: Pageable): Page<BookListing> =
        if (status != null) repository.findByStatus(status, pageable) else repository.findAll(pageable)

    fun requireActiveForPurchase(listing: BookListing) {
        if (listing.status != ListingStatus.ACTIVE) {
            throw ConflictException("LISTING_NOT_ACTIVE", "Anúncio não está ativo.")
        }
    }

    @Transactional
    fun decrementStock(listing: BookListing, quantity: Int) {
        if (listing.stockQuantity < quantity) {
            throw ConflictException(
                "INSUFFICIENT_STOCK",
                "Estoque insuficiente para o anúncio '${listing.book.title}'.",
            )
        }
        listing.stockQuantity -= quantity
        if (listing.stockQuantity == 0) {
            listing.status = ListingStatus.SOLD_OUT
        }
        listing.updatedAt = Instant.now()
    }

    @Transactional
    fun returnStock(listing: BookListing, quantity: Int) {
        listing.stockQuantity += quantity
        if (listing.status == ListingStatus.SOLD_OUT && listing.stockQuantity > 0) {
            listing.status = ListingStatus.ACTIVE
        }
        listing.updatedAt = Instant.now()
    }

    private fun getOwnedByOrThrow(userId: UUID, listingId: UUID): BookListing {
        val listing = getByIdRaw(listingId)
        val seller = sellerService.getByUserId(userId)
        if (listing.seller.id != seller.id) {
            throw ForbiddenException(message = "Você só pode gerenciar seus próprios anúncios.")
        }
        return listing
    }
}
