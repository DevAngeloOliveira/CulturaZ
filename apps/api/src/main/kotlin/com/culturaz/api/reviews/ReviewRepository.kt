package com.culturaz.api.reviews

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.math.BigDecimal
import java.util.UUID

@Repository
interface ReviewRepository : JpaRepository<Review, UUID> {
    fun findBySellerIdOrderByCreatedAtDesc(sellerId: UUID): List<Review>

    fun existsByOrderIdAndReviewerIdAndSellerId(orderId: UUID, reviewerId: UUID, sellerId: UUID): Boolean

    @Query("select coalesce(avg(cast(r.rating as double)), 0) from Review r where r.seller.id = :sellerId")
    fun averageRatingForSeller(@Param("sellerId") sellerId: UUID): Double

    @Query("select count(r) from Review r where r.seller.id = :sellerId")
    fun countBySellerId(@Param("sellerId") sellerId: UUID): Long
}
