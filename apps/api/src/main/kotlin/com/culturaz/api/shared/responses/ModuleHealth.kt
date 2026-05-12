package com.culturaz.api.shared.responses

import java.time.OffsetDateTime

data class ModuleHealth(
    val module: String,
    val status: String = "UP",
    val timestamp: OffsetDateTime = OffsetDateTime.now(),
)
