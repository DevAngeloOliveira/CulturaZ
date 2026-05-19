package com.culturaz.api.shared.exceptions

import com.culturaz.api.shared.responses.ApiErrorResponse
import com.culturaz.api.shared.responses.FieldErrorResponse
import jakarta.servlet.http.HttpServletRequest
import jakarta.validation.ConstraintViolationException
import org.slf4j.LoggerFactory
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.AuthenticationException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException

@RestControllerAdvice
class GlobalExceptionHandler {

    private val log = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    @ExceptionHandler(BusinessException::class)
    fun handleBusiness(ex: BusinessException, req: HttpServletRequest): ResponseEntity<ApiErrorResponse> =
        ResponseEntity.status(ex.httpStatus).body(
            ApiErrorResponse(
                code = ex.code,
                message = ex.message ?: "Erro de negócio.",
                path = req.requestURI,
            ),
        )

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException, req: HttpServletRequest): ResponseEntity<ApiErrorResponse> {
        val details = ex.bindingResult.fieldErrors.map {
            FieldErrorResponse(field = it.field, issue = it.defaultMessage ?: "valor inválido")
        }
        return ResponseEntity.badRequest().body(
            ApiErrorResponse(
                code = "VALIDATION_ERROR",
                message = "Existem campos inválidos na requisição.",
                path = req.requestURI,
                details = details,
            ),
        )
    }

    @ExceptionHandler(ConstraintViolationException::class)
    fun handleConstraint(ex: ConstraintViolationException, req: HttpServletRequest): ResponseEntity<ApiErrorResponse> {
        val details = ex.constraintViolations.map {
            FieldErrorResponse(field = it.propertyPath.toString(), issue = it.message)
        }
        return ResponseEntity.badRequest().body(
            ApiErrorResponse(
                code = "VALIDATION_ERROR",
                message = "Existem campos inválidos na requisição.",
                path = req.requestURI,
                details = details,
            ),
        )
    }

    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun handleUnreadable(ex: HttpMessageNotReadableException, req: HttpServletRequest): ResponseEntity<ApiErrorResponse> =
        ResponseEntity.badRequest().body(
            ApiErrorResponse(
                code = "MALFORMED_REQUEST",
                message = "Corpo da requisição não pôde ser lido.",
                path = req.requestURI,
            ),
        )

    @ExceptionHandler(MethodArgumentTypeMismatchException::class)
    fun handleTypeMismatch(ex: MethodArgumentTypeMismatchException, req: HttpServletRequest): ResponseEntity<ApiErrorResponse> =
        ResponseEntity.badRequest().body(
            ApiErrorResponse(
                code = "VALIDATION_ERROR",
                message = "Parâmetro '${ex.name}' com valor inválido.",
                path = req.requestURI,
            ),
        )

    @ExceptionHandler(BadCredentialsException::class)
    fun handleBadCredentials(ex: BadCredentialsException, req: HttpServletRequest): ResponseEntity<ApiErrorResponse> =
        ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            ApiErrorResponse(
                code = "INVALID_CREDENTIALS",
                message = "E-mail ou senha inválidos.",
                path = req.requestURI,
            ),
        )

    @ExceptionHandler(AuthenticationCredentialsNotFoundException::class, AuthenticationException::class)
    fun handleUnauthenticated(ex: Exception, req: HttpServletRequest): ResponseEntity<ApiErrorResponse> =
        ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            ApiErrorResponse(
                code = "AUTHENTICATION_REQUIRED",
                message = "Autenticação necessária para acessar este recurso.",
                path = req.requestURI,
            ),
        )

    @ExceptionHandler(AccessDeniedException::class)
    fun handleAccessDenied(ex: AccessDeniedException, req: HttpServletRequest): ResponseEntity<ApiErrorResponse> =
        ResponseEntity.status(HttpStatus.FORBIDDEN).body(
            ApiErrorResponse(
                code = "ACCESS_DENIED",
                message = "Você não tem permissão para acessar este recurso.",
                path = req.requestURI,
            ),
        )

    @ExceptionHandler(DataIntegrityViolationException::class)
    fun handleDataIntegrity(ex: DataIntegrityViolationException, req: HttpServletRequest): ResponseEntity<ApiErrorResponse> {
        log.warn("Violação de integridade: ${ex.message}")
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
            ApiErrorResponse(
                code = "DATA_INTEGRITY_VIOLATION",
                message = "Operação viola restrição de integridade dos dados.",
                path = req.requestURI,
            ),
        )
    }

    @ExceptionHandler(Exception::class)
    fun handleUnexpected(ex: Exception, req: HttpServletRequest): ResponseEntity<ApiErrorResponse> {
        log.error("Erro não tratado em ${req.requestURI}", ex)
        return ResponseEntity.internalServerError().body(
            ApiErrorResponse(
                code = "INTERNAL_ERROR",
                message = "Erro interno inesperado. Tente novamente em instantes.",
                path = req.requestURI,
            ),
        )
    }
}
