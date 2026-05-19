package com.culturaz.api.categories

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface CategoryRepository : JpaRepository<Category, UUID> {
    fun existsByName(name: String): Boolean
    fun findByActiveTrueOrderByNameAsc(): List<Category>
    fun findByNameIgnoreCase(name: String): Category?
}
