package com.culturaz.api.shared.responses

import org.springframework.data.domain.Page

data class PaginationResponse(
    val page: Int,
    val size: Int,
    val total: Long,
    val totalPages: Int,
)

data class PagedResponse<T>(
    val items: List<T>,
    val pagination: PaginationResponse,
) {
    companion object {
        fun <S, T> from(page: Page<S>, mapper: (S) -> T): PagedResponse<T> = PagedResponse(
            items = page.content.map(mapper),
            pagination = PaginationResponse(
                page = page.number,
                size = page.size,
                total = page.totalElements,
                totalPages = page.totalPages,
            ),
        )
    }
}
