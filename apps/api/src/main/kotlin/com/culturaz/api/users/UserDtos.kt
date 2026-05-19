package com.culturaz.api.users

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.time.Instant
import java.util.UUID

data class UserResponse(
    val id: UUID,
    val name: String,
    val email: String,
    val phone: String?,
    val status: UserStatus,
    val roles: Set<UserRole>,
    val createdAt: Instant,
)

data class UpdateUserRequest(
    @field:NotBlank(message = "Nome é obrigatório.")
    @field:Size(min = 2, max = 120, message = "Nome deve ter entre 2 e 120 caracteres.")
    val name: String,

    @field:Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres.")
    val phone: String?,
)

data class AddressRequest(
    @field:NotBlank(message = "Rótulo é obrigatório.")
    @field:Size(max = 60)
    val label: String,

    @field:NotBlank(message = "Destinatário é obrigatório.")
    @field:Size(max = 120)
    val recipient: String,

    @field:NotBlank(message = "Logradouro é obrigatório.")
    @field:Size(max = 200)
    val street: String,

    @field:NotBlank(message = "Número é obrigatório.")
    @field:Size(max = 20)
    val number: String,

    @field:Size(max = 120)
    val complement: String?,

    @field:NotBlank(message = "Bairro é obrigatório.")
    @field:Size(max = 120)
    val neighborhood: String,

    @field:NotBlank(message = "Cidade é obrigatória.")
    @field:Size(max = 120)
    val city: String,

    @field:NotBlank(message = "UF é obrigatória.")
    @field:Size(min = 2, max = 2, message = "UF deve ter 2 caracteres.")
    val state: String,

    @field:NotBlank(message = "CEP é obrigatório.")
    @field:Size(max = 20)
    val postalCode: String,

    val isDefault: Boolean = false,
)

data class AddressResponse(
    val id: UUID,
    val label: String,
    val recipient: String,
    val street: String,
    val number: String,
    val complement: String?,
    val neighborhood: String,
    val city: String,
    val state: String,
    val postalCode: String,
    val isDefault: Boolean,
    val createdAt: Instant,
)
