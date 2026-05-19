package com.culturaz.api.users

import com.culturaz.api.shared.security.requireAuthUser
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/users/me/addresses")
@SecurityRequirement(name = "bearerAuth")
class AddressController(private val addressService: AddressService) {

    @GetMapping
    fun list(): List<AddressResponse> {
        val auth = requireAuthUser()
        return addressService.listByUser(auth.id).map { it.toResponse() }
    }

    @PostMapping
    fun create(@Valid @RequestBody request: AddressRequest): ResponseEntity<AddressResponse> {
        val auth = requireAuthUser()
        val saved = addressService.create(auth.id, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.toResponse())
    }

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: UUID,
        @Valid @RequestBody request: AddressRequest,
    ): AddressResponse {
        val auth = requireAuthUser()
        return addressService.update(auth.id, id, request).toResponse()
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID): ResponseEntity<Void> {
        val auth = requireAuthUser()
        addressService.delete(auth.id, id)
        return ResponseEntity.noContent().build()
    }

    @PatchMapping("/{id}/default")
    fun setDefault(@PathVariable id: UUID): AddressResponse {
        val auth = requireAuthUser()
        return addressService.setDefault(auth.id, id).toResponse()
    }
}
