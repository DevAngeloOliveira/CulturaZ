package com.culturaz.api.books

import com.culturaz.api.categories.Category
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.ForeignKey
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "books")
class Book(
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    var id: UUID = UUID.randomUUID(),

    @Column(name = "title", nullable = false, length = 255)
    var title: String,

    @Column(name = "author", nullable = false, length = 255)
    var author: String,

    @Column(name = "publisher", length = 255)
    var publisher: String? = null,

    @Column(name = "isbn", length = 20)
    var isbn: String? = null,

    @Column(name = "publication_year")
    var publicationYear: Int? = null,

    @Column(name = "description", columnDefinition = "TEXT")
    var description: String? = null,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false, foreignKey = ForeignKey(name = "fk_books_category"))
    var category: Category,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now(),
)
