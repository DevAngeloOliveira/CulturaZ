package com.culturaz.api.admin

import com.culturaz.api.listings.BookListingRepository
import com.culturaz.api.listings.ListingStatus
import com.culturaz.api.orders.OrderRepository
import com.culturaz.api.sellers.SellerProfileRepository
import com.culturaz.api.sellers.SellerStatus
import com.culturaz.api.shared.exceptions.ConflictException
import com.culturaz.api.shared.exceptions.NotFoundException
import com.culturaz.api.users.User
import com.culturaz.api.users.UserRepository
import com.culturaz.api.users.UserStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID

@Service
class AdminService(
    private val userRepository: UserRepository,
    private val sellerRepository: SellerProfileRepository,
    private val listingRepository: BookListingRepository,
    private val orderRepository: OrderRepository,
    private val auditLogService: AuditLogService,
) {

    @Transactional(readOnly = true)
    fun dashboard(): AdminDashboardResponse {
        val users = userRepository.countByStatus(UserStatus.ACTIVE) +
            userRepository.countByStatus(UserStatus.BLOCKED) +
            userRepository.countByStatus(UserStatus.PENDING_VERIFICATION)
        val sellers = sellerRepository.countByStatus(SellerStatus.ACTIVE) +
            sellerRepository.countByStatus(SellerStatus.SUSPENDED) +
            sellerRepository.countByStatus(SellerStatus.PENDING_REVIEW)
        val activeListings = listingRepository.countByStatus(ListingStatus.ACTIVE)
        val pendingListings = listingRepository.countByStatus(ListingStatus.PENDING_REVIEW)
        val startOfDay = Instant.now().truncatedTo(ChronoUnit.DAYS)
        val ordersToday = orderRepository.countByCreatedAtAfter(startOfDay)
        val since30 = Instant.now().minus(30, ChronoUnit.DAYS)
        val gmv = orderRepository.gmvSince(since30).setScale(2, RoundingMode.HALF_UP)
        return AdminDashboardResponse(
            usersCount = users,
            sellersCount = sellers,
            activeListingsCount = activeListings,
            pendingListingsCount = pendingListings,
            ordersTodayCount = ordersToday,
            gmvLast30Days = gmv,
        )
    }

    @Transactional(readOnly = true)
    fun listUsers(status: UserStatus?, pageable: Pageable): Page<User> =
        if (status != null) userRepository.findByStatus(status, pageable)
        else userRepository.findAll(pageable)

    @Transactional(readOnly = true)
    fun getUser(id: UUID): User = userRepository.findById(id).orElseThrow {
        NotFoundException.of("Usuário", id)
    }

    @Transactional
    fun blockUser(actorId: UUID, id: UUID, reason: String?): User {
        val user = getUser(id)
        if (user.status == UserStatus.BLOCKED) {
            throw ConflictException("USER_ALREADY_BLOCKED", "Usuário já está bloqueado.")
        }
        user.status = UserStatus.BLOCKED
        user.updatedAt = Instant.now()
        auditLogService.record(
            action = AuditAction.USER_BLOCKED,
            actorUserId = actorId,
            resourceType = "User",
            resourceId = user.id,
            metadata = reason?.let { mapOf("reason" to it) },
        )
        return user
    }

    @Transactional
    fun unblockUser(actorId: UUID, id: UUID): User {
        val user = getUser(id)
        if (user.status != UserStatus.BLOCKED) {
            throw ConflictException("USER_NOT_BLOCKED", "Usuário não está bloqueado.")
        }
        user.status = UserStatus.ACTIVE
        user.updatedAt = Instant.now()
        auditLogService.record(
            action = AuditAction.USER_UNBLOCKED,
            actorUserId = actorId,
            resourceType = "User",
            resourceId = user.id,
        )
        return user
    }
}

fun User.toAdminResponse() = AdminUserResponse(
    id = id,
    name = name,
    email = email,
    phone = phone,
    status = status,
    roles = roles.toSet(),
    createdAt = createdAt,
)
