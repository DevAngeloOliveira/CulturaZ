package com.culturaz.api.users

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface AddressRepository : JpaRepository<Address, UUID> {
    fun findByUserIdOrderByIsDefaultDescCreatedAtAsc(userId: UUID): List<Address>
    fun findByIdAndUserId(id: UUID, userId: UUID): Address?
    fun findByUserIdAndIsDefaultTrue(userId: UUID): Address?

    @Modifying
    @Query("update Address a set a.isDefault = false where a.user.id = :userId")
    fun clearDefaultsForUser(@Param("userId") userId: UUID): Int
}
