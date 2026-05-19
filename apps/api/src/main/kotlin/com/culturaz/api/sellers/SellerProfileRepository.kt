package com.culturaz.api.sellers

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface SellerProfileRepository : JpaRepository<SellerProfile, UUID> {
    fun findByUserId(userId: UUID): SellerProfile?
    fun existsByUserId(userId: UUID): Boolean
    fun countByStatus(status: SellerStatus): Long
}
