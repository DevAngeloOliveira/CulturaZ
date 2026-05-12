package com.culturaz.api

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

@SpringBootTest
@ActiveProfiles("test")
class CulturaZApplicationTests {

    @Test
    fun contextLoads() {
        // Smoke test: garante que o contexto Spring carrega sem erro no perfil 'test'.
    }
}
