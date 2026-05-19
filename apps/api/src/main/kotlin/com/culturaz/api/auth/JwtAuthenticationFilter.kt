package com.culturaz.api.auth

import com.culturaz.api.shared.security.AuthUser
import com.fasterxml.jackson.databind.ObjectMapper
import com.culturaz.api.shared.responses.ApiErrorResponse
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val jwtService: JwtService,
    private val objectMapper: ObjectMapper,
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val header = request.getHeader(HttpHeaders.AUTHORIZATION)
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response)
            return
        }

        val token = header.removePrefix(BEARER_PREFIX).trim()
        if (token.isEmpty()) {
            filterChain.doFilter(request, response)
            return
        }

        try {
            val payload = jwtService.parse(token)
            if (payload.type != JwtPayload.TokenType.ACCESS) {
                writeError(response, request, "Token inválido para autenticação. Use um access token.")
                return
            }
            val authUser = AuthUser(id = payload.userId, email = payload.email, roles = payload.roles)
            val authorities = payload.roles.map { SimpleGrantedAuthority("ROLE_${it.name}") }
            val authentication = UsernamePasswordAuthenticationToken(authUser, null, authorities)
            authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
            SecurityContextHolder.getContext().authentication = authentication
            filterChain.doFilter(request, response)
        } catch (ex: InvalidTokenException) {
            writeError(response, request, ex.message ?: "Token inválido.")
        }
    }

    private fun writeError(response: HttpServletResponse, request: HttpServletRequest, message: String) {
        response.status = HttpStatus.UNAUTHORIZED.value()
        response.contentType = MediaType.APPLICATION_JSON_VALUE
        response.characterEncoding = Charsets.UTF_8.name()
        val body = ApiErrorResponse(
            code = "INVALID_TOKEN",
            message = message,
            path = request.requestURI,
        )
        response.outputStream.write(objectMapper.writeValueAsBytes(body))
    }

    companion object {
        private const val BEARER_PREFIX = "Bearer "
    }
}
