package com.culturaz.api.books

import com.culturaz.api.categories.CategoryService
import com.culturaz.api.shared.exceptions.ConflictException
import com.culturaz.api.shared.exceptions.NotFoundException
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

@Service
class BookService(
    private val repository: BookRepository,
    private val categoryService: CategoryService,
) {

    @Transactional(readOnly = true)
    fun getById(id: UUID): Book = repository.findById(id).orElseThrow {
        NotFoundException.of("Livro", id)
    }

    @Transactional(readOnly = true)
    fun search(
        q: String?,
        categoryId: UUID?,
        author: String?,
        isbn: String?,
        pageable: Pageable,
    ): Page<Book> = repository.search(
        q = q?.trim().orEmpty(),
        categoryId = categoryId,
        author = author?.trim().orEmpty(),
        isbn = isbn?.trim().orEmpty(),
        pageable = pageable,
    )

    @Transactional
    fun create(request: CreateBookRequest): Book {
        val category = categoryService.requireActive(request.categoryId)
        val isbn = request.isbn?.takeIf { it.isNotBlank() }
        if (isbn != null && repository.existsByIsbn(isbn)) {
            throw ConflictException("BOOK_ISBN_ALREADY_EXISTS", "Já existe um livro com este ISBN.")
        }
        val book = Book(
            title = request.title.trim(),
            author = request.author.trim(),
            publisher = request.publisher?.trim(),
            isbn = isbn,
            publicationYear = request.publicationYear,
            description = request.description?.trim(),
            category = category,
        )
        return repository.save(book)
    }

    @Transactional
    fun update(id: UUID, request: UpdateBookRequest): Book {
        val book = getById(id)
        val category = categoryService.requireActive(request.categoryId)
        val newIsbn = request.isbn?.takeIf { it.isNotBlank() }
        if (newIsbn != null && newIsbn != book.isbn && repository.existsByIsbn(newIsbn)) {
            throw ConflictException("BOOK_ISBN_ALREADY_EXISTS", "Já existe um livro com este ISBN.")
        }
        book.title = request.title.trim()
        book.author = request.author.trim()
        book.publisher = request.publisher?.trim()
        book.isbn = newIsbn
        book.publicationYear = request.publicationYear
        book.description = request.description?.trim()
        book.category = category
        book.updatedAt = Instant.now()
        return book
    }
}
