package com.culturaz.api.admin

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface AuditLogRepository : JpaRepository<AuditLog, UUID>
