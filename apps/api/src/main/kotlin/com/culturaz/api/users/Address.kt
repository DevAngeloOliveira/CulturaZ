package com.culturaz.api.users

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.ForeignKey
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "addresses")
class Address(
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    var id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = ForeignKey(name = "fk_addresses_user"))
    var user: User,

    @Column(name = "label", nullable = false, length = 60)
    var label: String,

    @Column(name = "recipient", nullable = false, length = 120)
    var recipient: String,

    @Column(name = "street", nullable = false, length = 200)
    var street: String,

    @Column(name = "number", nullable = false, length = 20)
    var number: String,

    @Column(name = "complement", length = 120)
    var complement: String? = null,

    @Column(name = "neighborhood", nullable = false, length = 120)
    var neighborhood: String,

    @Column(name = "city", nullable = false, length = 120)
    var city: String,

    @Column(name = "state", nullable = false, length = 2)
    var state: String,

    @Column(name = "postal_code", nullable = false, length = 20)
    var postalCode: String,

    @Column(name = "is_default", nullable = false)
    var isDefault: Boolean = false,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now(),
)
