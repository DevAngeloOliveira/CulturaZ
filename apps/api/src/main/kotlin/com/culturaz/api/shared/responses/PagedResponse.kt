package com.culturaz.api.shared.responses

data class PagedResponse<T>(
    val items: List<T>,
    val pagination: Pagination,
) {
    data class Pagination(
        val page: Int,
        val size: Int,
        val total: Long,
    )
}
