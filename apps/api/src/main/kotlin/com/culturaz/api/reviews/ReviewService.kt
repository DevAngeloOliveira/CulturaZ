package com.culturaz.api.reviews

import com.culturaz.api.admin.AuditAction
import com.culturaz.api.admin.AuditLogService
import com.culturaz.api.orders.OrderItemRepository
import com.culturaz.api.orders.OrderRepository
import com.culturaz.api.orders.OrderStatus
import com.culturaz.api.sellers.SellerProfileRepository
import com.culturaz.api.shared.exceptions.ConflictException
import com.culturaz.api.shared.exceptions.ForbiddenException
import com.culturaz.api.shared.exceptions.NotFoundException
import com.culturaz.api.users.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.math.RoundingMode
import java.util.UUID

@Service
class ReviewService(
    private val repository: ReviewRepository,
    private val orderRepository: OrderRepository,
    private val orderItemRepository: OrderItemRepository,
    private val userRepository: UserRepository,
    private val sellerRepository: SellerProfileRepository,
    private val auditLogService: AuditLogService,
) {

    @Transactional(readOnly = true)
    fun listForSeller(sellerId: UUID): List<ReviewResponse> =
        repository.findBySellerIdOrderByCreatedAtDesc(sellerId).map { it.toResponse() }

    @Transactional
    fun create(reviewerId: UUID, request: CreateReviewRequest): Review {
        val order = orderRepository.findById(request.orderId).orElseThrow {
            NotFoundException("ORDER_NOT_FOUND", "Pedido não encontrado.")
        }
        if (order.buyer.id != reviewerId) {
            throw ForbiddenException(message = "Apenas o comprador do pedido pode avaliá-lo.")
        }
        if (order.status != OrderStatus.DELIVERED) {
            throw ConflictException(
                "ORDER_NOT_DELIVERED",
                "Pedido precisa estar entregue para receber avaliação.",
            )
        }
        if (!orderItemRepository.existsByOrderIdAndSellerId(order.id, request.sellerId)) {
            throw ConflictException(
                "SELLER_NOT_IN_ORDER",
                "Este vendedor não está relacionado ao pedido informado.",
            )
        }
        if (repository.existsByOrderIdAndReviewerIdAndSellerId(order.id, reviewerId, request.sellerId)) {
            throw ConflictException("REVIEW_ALREADY_EXISTS", "Você já avaliou este vendedor neste pedido.")
        }
        val seller = sellerRepository.findById(request.sellerId).orElseThrow {
            NotFoundException("SELLER_PROFILE_NOT_FOUND", "Vendedor não encontrado.")
        }
        val reviewer = userRepository.findById(reviewerId).orElseThrow {
            NotFoundException.of("Usuário", reviewerId)
        }
        val tagsCsv = request.tags
            ?.mapNotNull { it.trim().takeIf { t -> t.isNotEmpty() } }
            ?.joinToString(",")
            ?.takeIf { it.isNotEmpty() }
        val review = Review(
            order = order,
            reviewer = reviewer,
            seller = seller,
            rating = request.rating,
            comment = request.comment?.trim()?.takeIf { it.isNotEmpty() },
            tags = tagsCsv,
        )
        val saved = repository.save(review)
        val avg = BigDecimal.valueOf(repository.averageRatingForSeller(seller.id))
            .setScale(2, RoundingMode.HALF_UP)
        seller.rating = avg
        auditLogService.record(
            action = AuditAction.REVIEW_CREATED,
            actorUserId = reviewerId,
            resourceType = "Review",
            resourceId = saved.id,
            metadata = mapOf("sellerId" to seller.id.toString(), "rating" to request.rating),
        )
        return saved
    }
}
