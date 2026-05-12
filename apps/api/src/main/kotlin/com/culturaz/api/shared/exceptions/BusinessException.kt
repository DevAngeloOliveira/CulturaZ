package com.culturaz.api.shared.exceptions

open class BusinessException(
    val code: String,
    message: String,
) : RuntimeException(message)
