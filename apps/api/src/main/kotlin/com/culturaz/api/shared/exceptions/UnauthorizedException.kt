package com.culturaz.api.shared.exceptions

import org.springframework.http.HttpStatus

open class UnauthorizedException(
    code: String = "INVALID_CREDENTIALS",
    message: String,
) : BusinessException(code = code, message = message, httpStatus = HttpStatus.UNAUTHORIZED)
