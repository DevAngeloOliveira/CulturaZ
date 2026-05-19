package com.culturaz.api.shared.responses

data class FieldErrorResponse(
    val field: String,
    val issue: String,
)
