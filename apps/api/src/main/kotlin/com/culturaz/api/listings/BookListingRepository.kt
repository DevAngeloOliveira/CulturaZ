package com.culturaz.api.listings

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.math.BigDecimal
import java.util.UUID

@Repository
interface BookListingRepository : JpaRepository<BookListing, UUID> {

    fun findBySellerId(sellerId: UUID, pageable: Pageable): Page<BookListing>
    fun countBySellerIdAndStatus(sellerId: UUID, status: ListingStatus): Long
    fun findByStatus(status: ListingStatus, pageable: Pageable): Page<BookListing>
    fun countByStatus(status: ListingStatus): Long

    @Query(
        """
        select l from BookListing l
        where l.status = :activeStatus
          and (:q = '' or lower(l.book.title) like lower(concat('%', :q, '%')) or lower(l.book.author) like lower(concat('%', :q, '%')))
          and (:categoryId is null or l.book.category.id = :categoryId)
          and (:condition is null or l.condition = :condition)
          and (:priceMin is null or l.price >= :priceMin)
          and (:priceMax is null or l.price <= :priceMax)
          and (:city = '' or lower(l.city) = lower(:city))
          and (:state = '' or lower(l.state) = lower(:state))
        """,
    )
    fun searchActive(
        @Param("activeStatus") activeStatus: ListingStatus,
        @Param("q") q: String,
        @Param("categoryId") categoryId: UUID?,
        @Param("condition") condition: BookCondition?,
        @Param("priceMin") priceMin: BigDecimal?,
        @Param("priceMax") priceMax: BigDecimal?,
        @Param("city") city: String,
        @Param("state") state: String,
        pageable: Pageable,
    ): Page<BookListing>
}
