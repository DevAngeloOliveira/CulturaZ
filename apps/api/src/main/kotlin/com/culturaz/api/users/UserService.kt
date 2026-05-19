package com.culturaz.api.users

import com.culturaz.api.shared.exceptions.NotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

@Service
class UserService(private val repository: UserRepository) {

    @Transactional(readOnly = true)
    fun getById(id: UUID): User = repository.findById(id).orElseThrow {
        NotFoundException.of("Usuário", id)
    }

    @Transactional(readOnly = true)
    fun getByEmail(email: String): User = repository.findByEmail(email).orElseThrow {
        NotFoundException.of("Usuário", email)
    }

    @Transactional
    fun updateProfile(userId: UUID, request: UpdateUserRequest): User {
        val user = getById(userId)
        user.name = request.name
        user.phone = request.phone
        user.updatedAt = Instant.now()
        return user
    }
}
