package com.culturaz.api.orders

import jakarta.persistence.EntityManager
import org.springframework.stereotype.Component
import java.time.Instant
import java.time.ZoneOffset

@Component
class OrderCodeGenerator(private val entityManager: EntityManager) {

    fun next(): String {
        val nextVal = entityManager
            .createNativeQuery("select nextval('order_code_seq')")
            .singleResult as Number
        val year = Instant.now().atZone(ZoneOffset.UTC).year
        return "CZ-%d-%06d".format(year, nextVal.toLong())
    }
}
