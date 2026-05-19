package com.culturaz.api.shared.exceptions

import org.springframework.http.HttpStatus

open class BusinessException(
    val code: String,
    message: String,
    val httpStatus: HttpStatus = HttpStatus.BAD_REQUEST,
) : RuntimeException(message)
