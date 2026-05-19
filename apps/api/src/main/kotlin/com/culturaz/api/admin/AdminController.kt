package com.culturaz.api.admin

import com.culturaz.api.shared.responses.PagedResponse
import com.culturaz.api.shared.security.requireAuthUser
import com.culturaz.api.users.UserStatus
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/admin")
@SecurityRequirement(name = "bearerAuth")
class AdminController(private val adminService: AdminService) {

    @GetMapping("/dashboard")
    fun dashboard(): AdminDashboardResponse = adminService.dashboard()

    @GetMapping("/users")
    fun listUsers(
        @RequestParam(required = false) status: UserStatus?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
    ): PagedResponse<AdminUserResponse> {
        val pageable = PageRequest.of(
            page.coerceAtLeast(0),
            size.coerceIn(1, 100),
            Sort.by(Sort.Direction.DESC, "createdAt"),
        )
        return PagedResponse.from(adminService.listUsers(status, pageable)) { it.toAdminResponse() }
    }

    @GetMapping("/users/{id}")
    fun getUser(@PathVariable id: UUID): AdminUserResponse =
        adminService.getUser(id).toAdminResponse()

    @PatchMapping("/users/{id}/block")
    fun blockUser(
        @PathVariable id: UUID,
        @RequestBody(required = false) body: BlockUserRequest?,
    ): AdminUserResponse {
        val actor = requireAuthUser()
        return adminService.blockUser(actor.id, id, body?.reason).toAdminResponse()
    }

    @PatchMapping("/users/{id}/unblock")
    fun unblockUser(@PathVariable id: UUID): AdminUserResponse {
        val actor = requireAuthUser()
        return adminService.unblockUser(actor.id, id).toAdminResponse()
    }
}
