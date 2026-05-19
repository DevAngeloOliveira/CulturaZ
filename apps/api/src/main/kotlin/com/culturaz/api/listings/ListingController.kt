package com.culturaz.api.listings

import com.culturaz.api.shared.responses.PagedResponse
import com.culturaz.api.shared.security.requireAuthUser
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
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
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal
import java.util.UUID

@RestController
@RequestMapping("/api/listings")
class PublicListingController(private val listingService: ListingService) {

    @GetMapping
    fun search(
        @RequestParam(required = false) q: String?,
        @RequestParam(required = false) categoryId: UUID?,
        @RequestParam(required = false) condition: BookCondition?,
        @RequestParam(required = false) priceMin: BigDecimal?,
        @RequestParam(required = false) priceMax: BigDecimal?,
        @RequestParam(required = false) city: String?,
        @RequestParam(required = false) state: String?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
        @RequestParam(defaultValue = "createdAt,desc") sort: String,
    ): PagedResponse<ListingResponse> {
        val pageable = PageRequest.of(page.coerceAtLeast(0), size.coerceIn(1, 100), parseSort(sort))
        val result = listingService.searchActive(q, categoryId, condition, priceMin, priceMax, city, state, pageable)
        return PagedResponse.from(result) { it.toResponse() }
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): ListingResponse =
        listingService.getPublicById(id).toResponse()
}

@RestController
@RequestMapping("/api/seller/listings")
@SecurityRequirement(name = "bearerAuth")
class SellerListingController(private val listingService: ListingService) {

    @GetMapping
    fun listMine(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
        @RequestParam(defaultValue = "createdAt,desc") sort: String,
    ): PagedResponse<ListingResponse> {
        val auth = requireAuthUser()
        val pageable = PageRequest.of(page.coerceAtLeast(0), size.coerceIn(1, 100), parseSort(sort))
        val result = listingService.listForSeller(auth.id, pageable)
        return PagedResponse.from(result) { it.toResponse() }
    }

    @PostMapping
    fun create(@Valid @RequestBody request: CreateListingRequest): ResponseEntity<ListingResponse> {
        val auth = requireAuthUser()
        val saved = listingService.createForUser(auth.id, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.toResponse())
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: UUID, @Valid @RequestBody request: UpdateListingRequest): ListingResponse {
        val auth = requireAuthUser()
        return listingService.updateOwnedBy(auth.id, id, request).toResponse()
    }

    @PatchMapping("/{id}/pause")
    fun pause(@PathVariable id: UUID): ListingResponse {
        val auth = requireAuthUser()
        return listingService.pauseOwnedBy(auth.id, id).toResponse()
    }

    @PatchMapping("/{id}/activate")
    fun activate(@PathVariable id: UUID): ListingResponse {
        val auth = requireAuthUser()
        return listingService.activateOwnedBy(auth.id, id).toResponse()
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID): ResponseEntity<Void> {
        val auth = requireAuthUser()
        listingService.removeOwnedBy(auth.id, id)
        return ResponseEntity.noContent().build()
    }
}

data class ModerateListingRequest(val reason: String? = null)

@RestController
@RequestMapping("/api/admin/listings")
@SecurityRequirement(name = "bearerAuth")
class AdminListingController(private val listingService: ListingService) {

    @GetMapping
    fun list(
        @RequestParam(required = false) status: ListingStatus?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
    ): PagedResponse<ListingResponse> {
        val pageable = PageRequest.of(
            page.coerceAtLeast(0),
            size.coerceIn(1, 100),
            Sort.by(Sort.Direction.DESC, "createdAt"),
        )
        return PagedResponse.from(listingService.listByStatusForAdmin(status, pageable)) { it.toResponse() }
    }

    @PatchMapping("/{id}/approve")
    fun approve(@PathVariable id: UUID): ListingResponse {
        val auth = requireAuthUser()
        return listingService.approveAsAdmin(auth.id, id).toResponse()
    }

    @PatchMapping("/{id}/block")
    fun block(
        @PathVariable id: UUID,
        @RequestBody(required = false) body: ModerateListingRequest?,
    ): ListingResponse {
        val auth = requireAuthUser()
        return listingService.blockAsAdmin(auth.id, id, body?.reason).toResponse()
    }
}

private fun parseSort(sort: String): Sort {
    val parts = sort.split(",").map { it.trim() }
    val field = parts.getOrNull(0)?.takeIf { it.isNotBlank() } ?: "createdAt"
    val direction = parts.getOrNull(1)?.lowercase() ?: "desc"
    return Sort.by(if (direction == "asc") Sort.Direction.ASC else Sort.Direction.DESC, field)
}
