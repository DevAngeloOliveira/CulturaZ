package com.culturaz.api.users

import jakarta.persistence.CollectionTable
import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.ForeignKey
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "users")
class User(
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    var id: UUID = UUID.randomUUID(),

    @Column(name = "name", nullable = false, length = 120)
    var name: String,

    @Column(name = "email", nullable = false, length = 160, unique = true)
    var email: String,

    @Column(name = "password_hash", nullable = false, length = 120)
    var passwordHash: String,

    @Column(name = "phone", length = 20)
    var phone: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    var status: UserStatus = UserStatus.ACTIVE,

    @ElementCollection(targetClass = UserRole::class, fetch = FetchType.EAGER)
    @CollectionTable(
        name = "user_roles",
        joinColumns = [JoinColumn(name = "user_id", foreignKey = ForeignKey(name = "fk_user_roles_user"))],
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    var roles: MutableSet<UserRole> = mutableSetOf(UserRole.CUSTOMER),

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now(),
)
