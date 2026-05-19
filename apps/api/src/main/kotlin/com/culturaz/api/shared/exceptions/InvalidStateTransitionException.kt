package com.culturaz.api.shared.exceptions

import org.springframework.http.HttpStatus

class InvalidStateTransitionException(
    message: String,
) : BusinessException(
    code = "INVALID_STATUS_TRANSITION",
    message = message,
    httpStatus = HttpStatus.CONFLICT,
) {
    companion object {
        fun of(from: Enum<*>, to: Enum<*>) =
            InvalidStateTransitionException("Transição inválida de ${from.name} para ${to.name}.")
    }
}
