package com.culturaz.api.shared.exceptions

import org.springframework.http.HttpStatus

open class NotFoundException(
    code: String = "RESOURCE_NOT_FOUND",
    message: String,
) : BusinessException(code = code, message = message, httpStatus = HttpStatus.NOT_FOUND) {
    companion object {
        fun of(resource: String, identifier: Any) =
            NotFoundException(message = "$resource não encontrado para identificador '$identifier'")
    }
}
