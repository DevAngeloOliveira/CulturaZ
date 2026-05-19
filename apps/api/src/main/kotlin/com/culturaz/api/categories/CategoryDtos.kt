package com.culturaz.api.categories

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.util.UUID

data class CategoryResponse(
    val id: UUID,
    val name: String,
    val description: String?,
    val icon: String?,
    val active: Boolean,
)

data class CreateCategoryRequest(
    @field:NotBlank(message = "Nome é obrigatório.")
    @field:Size(min = 2, max = 120)
    val name: String,

    @field:Size(max = 2000)
    val description: String?,

    @field:Size(max = 60)
    val icon: String?,
)

data class UpdateCategoryRequest(
    @field:NotBlank(message = "Nome é obrigatório.")
    @field:Size(min = 2, max = 120)
    val name: String,

    @field:Size(max = 2000)
    val description: String?,

    @field:Size(max = 60)
    val icon: String?,
)

fun Category.toResponse() = CategoryResponse(
    id = id,
    name = name,
    description = description,
    icon = icon,
    active = active,
)
