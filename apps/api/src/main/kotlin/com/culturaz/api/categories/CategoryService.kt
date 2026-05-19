package com.culturaz.api.categories

import com.culturaz.api.admin.AuditAction
import com.culturaz.api.admin.AuditLogService
import com.culturaz.api.shared.exceptions.ConflictException
import com.culturaz.api.shared.exceptions.NotFoundException
import com.culturaz.api.shared.security.requireAuthUser
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

@Service
class CategoryService(
    private val repository: CategoryRepository,
    private val auditLogService: AuditLogService,
) {

    @Transactional(readOnly = true)
    fun listActive(): List<Category> = repository.findByActiveTrueOrderByNameAsc()

    @Transactional(readOnly = true)
    fun listAll(): List<Category> = repository.findAll().sortedBy { it.name }

    @Transactional(readOnly = true)
    fun getById(id: UUID): Category = repository.findById(id).orElseThrow {
        NotFoundException.of("Categoria", id)
    }

    @Transactional
    fun create(request: CreateCategoryRequest): Category {
        if (repository.existsByName(request.name.trim())) {
            throw ConflictException("CATEGORY_ALREADY_EXISTS", "Já existe uma categoria com este nome.")
        }
        val category = Category(
            name = request.name.trim(),
            description = request.description?.trim(),
            icon = request.icon?.trim(),
            active = true,
        )
        val saved = repository.save(category)
        auditLogService.record(
            action = AuditAction.CATEGORY_CREATED,
            actorUserId = requireAuthUser().id,
            resourceType = "Category",
            resourceId = saved.id,
            metadata = mapOf("name" to saved.name),
        )
        return saved
    }

    @Transactional
    fun update(id: UUID, request: UpdateCategoryRequest): Category {
        val category = getById(id)
        val newName = request.name.trim()
        if (newName != category.name) {
            val existing = repository.findByNameIgnoreCase(newName)
            if (existing != null && existing.id != category.id) {
                throw ConflictException("CATEGORY_ALREADY_EXISTS", "Já existe uma categoria com este nome.")
            }
            category.name = newName
        }
        category.description = request.description?.trim()
        category.icon = request.icon?.trim()
        category.updatedAt = Instant.now()
        auditLogService.record(
            action = AuditAction.CATEGORY_UPDATED,
            actorUserId = requireAuthUser().id,
            resourceType = "Category",
            resourceId = category.id,
        )
        return category
    }

    @Transactional
    fun activate(id: UUID): Category {
        val category = getById(id)
        if (!category.active) {
            category.active = true
            category.updatedAt = Instant.now()
            auditLogService.record(
                action = AuditAction.CATEGORY_ACTIVATED,
                actorUserId = requireAuthUser().id,
                resourceType = "Category",
                resourceId = category.id,
            )
        }
        return category
    }

    @Transactional
    fun deactivate(id: UUID): Category {
        val category = getById(id)
        if (category.active) {
            category.active = false
            category.updatedAt = Instant.now()
            auditLogService.record(
                action = AuditAction.CATEGORY_DEACTIVATED,
                actorUserId = requireAuthUser().id,
                resourceType = "Category",
                resourceId = category.id,
            )
        }
        return category
    }

    @Transactional(readOnly = true)
    fun requireActive(id: UUID): Category {
        val category = getById(id)
        if (!category.active) {
            throw ConflictException("CATEGORY_INACTIVE", "Categoria inativa não pode ser utilizada.")
        }
        return category
    }
}
