package com.culturaz.api.books

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface BookRepository : JpaRepository<Book, UUID> {
    fun existsByIsbn(isbn: String): Boolean

    @Query(
        """
        select b from Book b
        where (:q = '' or lower(b.title) like lower(concat('%', :q, '%')) or lower(b.author) like lower(concat('%', :q, '%')))
          and (:categoryId is null or b.category.id = :categoryId)
          and (:author = '' or lower(b.author) like lower(concat('%', :author, '%')))
          and (:isbn = '' or b.isbn = :isbn)
        """,
    )
    fun search(
        @Param("q") q: String,
        @Param("categoryId") categoryId: UUID?,
        @Param("author") author: String,
        @Param("isbn") isbn: String,
        pageable: Pageable,
    ): Page<Book>
}
