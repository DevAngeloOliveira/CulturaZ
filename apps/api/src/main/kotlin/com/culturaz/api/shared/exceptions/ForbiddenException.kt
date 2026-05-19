package com.culturaz.api.shared.exceptions

import org.springframework.http.HttpStatus

open class ForbiddenException(
    code: String = "ACCESS_DENIED",
    message: String = "Você não tem permissão para acessar este recurso.",
) : BusinessException(code = code, message = message, httpStatus = HttpStatus.FORBIDDEN)
