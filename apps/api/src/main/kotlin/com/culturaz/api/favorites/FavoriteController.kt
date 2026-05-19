package com.culturaz.api.favorites

import com.culturaz.api.shared.security.requireAuthUser
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/favorites")
@SecurityRequirement(name = "bearerAuth")
class FavoriteController(private val favoriteService: FavoriteService) {

    @GetMapping
    fun list(): List<FavoriteResponse> {
        val auth = requireAuthUser()
        return favoriteService.listByUser(auth.id).map { it.toResponse() }
    }

    @PostMapping("/{listingId}")
    fun add(@PathVariable listingId: UUID): ResponseEntity<FavoriteResponse> {
        val auth = requireAuthUser()
        val saved = favoriteService.add(auth.id, listingId)
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.toResponse())
    }

    @DeleteMapping("/{listingId}")
    fun remove(@PathVariable listingId: UUID): ResponseEntity<Void> {
        val auth = requireAuthUser()
        favoriteService.remove(auth.id, listingId)
        return ResponseEntity.noContent().build()
    }
}
