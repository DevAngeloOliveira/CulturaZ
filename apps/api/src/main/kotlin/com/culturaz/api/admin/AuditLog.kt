package com.culturaz.api.admin

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "audit_logs")
class AuditLog(
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    var id: UUID = UUID.randomUUID(),

    @Column(name = "actor_user_id")
    var actorUserId: UUID? = null,

    @Column(name = "action", nullable = false, length = 60)
    var action: String,

    @Column(name = "resource_type", nullable = false, length = 40)
    var resourceType: String,

    @Column(name = "resource_id")
    var resourceId: UUID? = null,

    @Column(name = "metadata", columnDefinition = "TEXT")
    var metadata: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.now(),
)
