package com.culturaz.api.admin

import com.culturaz.api.users.UserRole
import com.culturaz.api.users.UserStatus
import jakarta.validation.constraints.Size
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

data class AdminDashboardResponse(
    val usersCount: Long,
    val sellersCount: Long,
    val activeListingsCount: Long,
    val pendingListingsCount: Long,
    val ordersTodayCount: Long,
    val gmvLast30Days: BigDecimal,
)

data class AdminUserResponse(
    val id: UUID,
    val name: String,
    val email: String,
    val phone: String?,
    val status: UserStatus,
    val roles: Set<UserRole>,
    val createdAt: Instant,
)

data class BlockUserRequest(
    @field:Size(max = 500)
    val reason: String? = null,
)
