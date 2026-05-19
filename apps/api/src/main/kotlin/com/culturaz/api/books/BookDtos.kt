package com.culturaz.api.books

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.util.UUID

data class BookResponse(
    val id: UUID,
    val title: String,
    val author: String,
    val publisher: String?,
    val isbn: String?,
    val publicationYear: Int?,
    val description: String?,
    val categoryId: UUID,
    val categoryName: String,
)

data class CreateBookRequest(
    @field:NotBlank(message = "Título é obrigatório.")
    @field:Size(max = 255)
    val title: String,

    @field:NotBlank(message = "Autor é obrigatório.")
    @field:Size(max = 255)
    val author: String,

    @field:Size(max = 255)
    val publisher: String?,

    @field:Size(max = 20)
    val isbn: String?,

    val publicationYear: Int?,

    @field:Size(max = 4000)
    val description: String?,

    @field:NotNull(message = "Categoria é obrigatória.")
    val categoryId: UUID,
)

data class UpdateBookRequest(
    @field:NotBlank
    @field:Size(max = 255)
    val title: String,

    @field:NotBlank
    @field:Size(max = 255)
    val author: String,

    @field:Size(max = 255)
    val publisher: String?,

    @field:Size(max = 20)
    val isbn: String?,

    val publicationYear: Int?,

    @field:Size(max = 4000)
    val description: String?,

    @field:NotNull
    val categoryId: UUID,
)

fun Book.toResponse(): BookResponse = BookResponse(
    id = id,
    title = title,
    author = author,
    publisher = publisher,
    isbn = isbn,
    publicationYear = publicationYear,
    description = description,
    categoryId = category.id,
    categoryName = category.name,
)
