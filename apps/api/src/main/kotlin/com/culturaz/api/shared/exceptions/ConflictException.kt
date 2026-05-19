package com.culturaz.api.shared.exceptions

import org.springframework.http.HttpStatus

open class ConflictException(
    code: String,
    message: String,
) : BusinessException(code = code, message = message, httpStatus = HttpStatus.CONFLICT)
