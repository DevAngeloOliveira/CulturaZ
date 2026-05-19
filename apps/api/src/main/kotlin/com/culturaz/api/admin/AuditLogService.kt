package com.culturaz.api.admin

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class AuditLogService(
    private val repository: AuditLogRepository,
    private val objectMapper: ObjectMapper,
) {

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun record(
        action: AuditAction,
        actorUserId: UUID?,
        resourceType: String,
        resourceId: UUID?,
        metadata: Map<String, Any?>? = null,
    ): AuditLog {
        val log = AuditLog(
            actorUserId = actorUserId,
            action = action.name,
            resourceType = resourceType,
            resourceId = resourceId,
            metadata = metadata?.let { objectMapper.writeValueAsString(it) },
        )
        return repository.save(log)
    }
}

enum class AuditAction {
    USER_BLOCKED,
    USER_UNBLOCKED,
    SELLER_CREATED,
    CATEGORY_CREATED,
    CATEGORY_UPDATED,
    CATEGORY_ACTIVATED,
    CATEGORY_DEACTIVATED,
    LISTING_CREATED,
    LISTING_APPROVED,
    LISTING_BLOCKED,
    LISTING_PAUSED,
    LISTING_ACTIVATED,
    LISTING_REMOVED,
    ORDER_CREATED,
    ORDER_CANCELLED,
    ORDER_STATUS_UPDATED,
    REVIEW_CREATED,
}
