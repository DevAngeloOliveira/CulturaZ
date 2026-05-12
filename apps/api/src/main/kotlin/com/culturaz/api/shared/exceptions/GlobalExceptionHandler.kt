package com.culturaz.api.shared.exceptions

import com.culturaz.api.shared.responses.ApiError
import jakarta.servlet.http.HttpServletRequest
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {

    private val log = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    @ExceptionHandler(ResourceNotFoundException::class)
    fun handleNotFound(ex: ResourceNotFoundException, req: HttpServletRequest): ResponseEntity<ApiError> =
        ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ApiError(code = ex.code, message = ex.message ?: "Recurso não encontrado", path = req.requestURI),
        )

    @ExceptionHandler(BusinessException::class)
    fun handleBusiness(ex: BusinessException, req: HttpServletRequest): ResponseEntity<ApiError> =
        ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ApiError(code = ex.code, message = ex.message ?: "Erro de negócio", path = req.requestURI),
        )

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException, req: HttpServletRequest): ResponseEntity<ApiError> {
        val details = ex.bindingResult.fieldErrors.map {
            ApiError.FieldError(field = it.field, issue = it.defaultMessage ?: "valor inválido")
        }
        return ResponseEntity.badRequest().body(
            ApiError(
                code = "VALIDATION_ERROR",
                message = "Falha na validação dos campos enviados",
                path = req.requestURI,
                details = details,
            ),
        )
    }

    @ExceptionHandler(Exception::class)
    fun handleUnexpected(ex: Exception, req: HttpServletRequest): ResponseEntity<ApiError> {
        log.error("Erro não tratado em ${req.requestURI}", ex)
        return ResponseEntity.internalServerError().body(
            ApiError(
                code = "INTERNAL_ERROR",
                message = "Erro interno inesperado. Tente novamente em instantes.",
                path = req.requestURI,
            ),
        )
    }
}
