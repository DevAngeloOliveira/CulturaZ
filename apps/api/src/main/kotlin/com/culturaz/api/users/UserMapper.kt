package com.culturaz.api.users

fun User.toResponse(): UserResponse = UserResponse(
    id = id,
    name = name,
    email = email,
    phone = phone,
    status = status,
    roles = roles.toSet(),
    createdAt = createdAt,
)

fun Address.toResponse(): AddressResponse = AddressResponse(
    id = id,
    label = label,
    recipient = recipient,
    street = street,
    number = number,
    complement = complement,
    neighborhood = neighborhood,
    city = city,
    state = state,
    postalCode = postalCode,
    isDefault = isDefault,
    createdAt = createdAt,
)
