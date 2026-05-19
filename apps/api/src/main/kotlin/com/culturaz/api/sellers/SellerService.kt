package com.culturaz.api.sellers

import com.culturaz.api.admin.AuditAction
import com.culturaz.api.admin.AuditLogService
import com.culturaz.api.listings.BookListingRepository
import com.culturaz.api.listings.ListingStatus
import com.culturaz.api.orders.OrderItemRepository
import com.culturaz.api.orders.OrderStatus
import com.culturaz.api.reviews.ReviewRepository
import com.culturaz.api.shared.exceptions.ConflictException
import com.culturaz.api.shared.exceptions.ForbiddenException
import com.culturaz.api.shared.exceptions.NotFoundException
import com.culturaz.api.users.UserRepository
import com.culturaz.api.users.UserRole
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID

@Service
class SellerService(
    private val repository: SellerProfileRepository,
    private val userRepository: UserRepository,
    private val auditLogService: AuditLogService,
    private val listingRepository: BookListingRepository,
    private val orderItemRepository: OrderItemRepository,
    private val orderRepository: com.culturaz.api.orders.OrderRepository,
    private val reviewRepository: ReviewRepository,
) {

    @Transactional
    fun activate(userId: UUID, request: CreateSellerRequest): SellerProfile {
        if (repository.existsByUserId(userId)) {
            throw ConflictException("SELLER_PROFILE_ALREADY_EXISTS", "Você já possui um perfil de vendedor.")
        }
        val user = userRepository.findById(userId).orElseThrow {
            NotFoundException.of("Usuário", userId)
        }
        val profile = SellerProfile(
            user = user,
            storeName = request.storeName.trim(),
            description = request.description?.trim(),
            type = request.type,
            status = SellerStatus.ACTIVE,
        )
        val saved = repository.save(profile)
        user.roles.add(UserRole.SELLER)
        user.updatedAt = Instant.now()
        auditLogService.record(
            action = AuditAction.SELLER_CREATED,
            actorUserId = userId,
            resourceType = "SellerProfile",
            resourceId = saved.id,
            metadata = mapOf("storeName" to saved.storeName, "type" to saved.type.name),
        )
        return saved
    }

    @Transactional(readOnly = true)
    fun getByUserId(userId: UUID): SellerProfile = repository.findByUserId(userId)
        ?: throw NotFoundException("SELLER_PROFILE_NOT_FOUND", "Perfil de vendedor não encontrado.")

    @Transactional(readOnly = true)
    fun getById(id: UUID): SellerProfile = repository.findById(id).orElseThrow {
        NotFoundException("SELLER_PROFILE_NOT_FOUND", "Perfil de vendedor não encontrado.")
    }

    @Transactional
    fun update(userId: UUID, request: UpdateSellerRequest): SellerProfile {
        val profile = getByUserId(userId)
        profile.storeName = request.storeName.trim()
        profile.description = request.description?.trim()
        profile.type = request.type
        profile.updatedAt = Instant.now()
        return profile
    }

    @Transactional(readOnly = true)
    fun requireActiveSeller(userId: UUID): SellerProfile {
        val profile = getByUserId(userId)
        when (profile.status) {
            SellerStatus.SUSPENDED -> throw ForbiddenException(
                code = "SELLER_SUSPENDED",
                message = "Conta de vendedor suspensa. Entre em contato com o suporte.",
            )
            SellerStatus.PENDING_REVIEW -> throw ForbiddenException(
                code = "SELLER_PENDING_REVIEW",
                message = "Conta de vendedor aguardando revisão.",
            )
            SellerStatus.ACTIVE -> Unit
        }
        return profile
    }

    @Transactional(readOnly = true)
    fun buildDashboard(userId: UUID): SellerDashboardResponse {
        val profile = getByUserId(userId)
        val activeListings = listingRepository.countBySellerIdAndStatus(profile.id, ListingStatus.ACTIVE)
        val pendingListings = listingRepository.countBySellerIdAndStatus(profile.id, ListingStatus.PENDING_REVIEW)
        val soldOutListings = listingRepository.countBySellerIdAndStatus(profile.id, ListingStatus.SOLD_OUT)
        val ordersOpen = countOpenOrdersForSeller(profile.id)
        val since = Instant.now().minus(30, ChronoUnit.DAYS)
        val sales = orderItemRepository.countDistinctOrdersBySellerSince(profile.id, since)
        val revenue = orderItemRepository.revenueBySellerSince(profile.id, since)
        val avg = BigDecimal.valueOf(reviewRepository.averageRatingForSeller(profile.id))
            .setScale(2, RoundingMode.HALF_UP)
        return SellerDashboardResponse(
            activeListings = activeListings,
            pendingListings = pendingListings,
            soldOutListings = soldOutListings,
            ordersOpen = ordersOpen,
            salesLast30Days = sales,
            revenueLast30Days = revenue,
            averageRating = avg,
        )
    }

    private fun countOpenOrdersForSeller(sellerId: UUID): Long =
        orderRepository.countOrdersBySellerAndStatusIn(
            sellerId,
            listOf(
                OrderStatus.CREATED,
                OrderStatus.WAITING_PAYMENT,
                OrderStatus.CONFIRMED,
                OrderStatus.IN_PREPARATION,
                OrderStatus.SHIPPED,
            ),
        )

    @Transactional(readOnly = true)
    fun buildReputation(sellerId: UUID): SellerReputationResponse {
        val profile = getById(sellerId)
        val avg = BigDecimal.valueOf(reviewRepository.averageRatingForSeller(profile.id))
            .setScale(2, RoundingMode.HALF_UP)
        val total = reviewRepository.countBySellerId(profile.id)
        return SellerReputationResponse(
            sellerId = profile.id,
            averageRating = avg,
            totalReviews = total,
        )
    }

    @Transactional
    fun recalculateRating(sellerId: UUID) {
        val profile = getById(sellerId)
        val avg = BigDecimal.valueOf(reviewRepository.averageRatingForSeller(profile.id))
            .setScale(2, RoundingMode.HALF_UP)
        profile.rating = avg
        profile.updatedAt = Instant.now()
    }
}
