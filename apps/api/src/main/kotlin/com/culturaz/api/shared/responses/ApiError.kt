package com.culturaz.api.shared.responses

import java.time.OffsetDateTime

data class ApiError(
    val code: String,
    val message: String,
    val path: String? = null,
    val details: List<FieldError>? = null,
    val timestamp: OffsetDateTime = OffsetDateTime.now(),
) {
    data class FieldError(
        val field: String,
        val issue: String,
    )
}
