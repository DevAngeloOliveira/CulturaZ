package com.culturaz.api.sellers

import com.culturaz.api.reviews.ReviewResponse
import com.culturaz.api.reviews.ReviewService
import com.culturaz.api.shared.security.requireAuthUser
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/sellers")
class SellerController(
    private val sellerService: SellerService,
    private val reviewService: ReviewService,
) {

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    fun activate(@Valid @RequestBody request: CreateSellerRequest): ResponseEntity<SellerProfileResponse> {
        val auth = requireAuthUser()
        val saved = sellerService.activate(auth.id, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.toResponse())
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    fun me(): SellerProfileResponse {
        val auth = requireAuthUser()
        return sellerService.getByUserId(auth.id).toResponse()
    }

    @PutMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    fun updateMe(@Valid @RequestBody request: UpdateSellerRequest): SellerProfileResponse {
        val auth = requireAuthUser()
        return sellerService.update(auth.id, request).toResponse()
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): SellerProfileResponse =
        sellerService.getById(id).toResponse()

    @GetMapping("/{id}/reviews")
    fun reviews(@PathVariable id: UUID): List<ReviewResponse> =
        reviewService.listForSeller(id)

    @GetMapping("/me/dashboard")
    @SecurityRequirement(name = "bearerAuth")
    fun dashboard(): SellerDashboardResponse {
        val auth = requireAuthUser()
        return sellerService.buildDashboard(auth.id)
    }

    @GetMapping("/me/reputation")
    @SecurityRequirement(name = "bearerAuth")
    fun reputation(): SellerReputationResponse {
        val auth = requireAuthUser()
        val profile = sellerService.getByUserId(auth.id)
        return sellerService.buildReputation(profile.id)
    }
}
