package com.culturaz.api.shared.responses

import java.time.Instant

data class ApiErrorResponse(
    val code: String,
    val message: String,
    val path: String? = null,
    val details: List<FieldErrorResponse>? = null,
    val timestamp: Instant = Instant.now(),
)
