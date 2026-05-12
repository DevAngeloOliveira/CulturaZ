package com.culturaz.api.shared.exceptions

class ResourceNotFoundException(
    resource: String,
    identifier: Any,
) : BusinessException(
    code = "RESOURCE_NOT_FOUND",
    message = "$resource não encontrado para identificador '$identifier'",
)
