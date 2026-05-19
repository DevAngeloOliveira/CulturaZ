package com.culturaz.api.users

import com.culturaz.api.shared.exceptions.NotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

@Service
class AddressService(
    private val addressRepository: AddressRepository,
    private val userRepository: UserRepository,
) {

    @Transactional(readOnly = true)
    fun listByUser(userId: UUID): List<Address> =
        addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtAsc(userId)

    @Transactional
    fun create(userId: UUID, request: AddressRequest): Address {
        val user = userRepository.findById(userId).orElseThrow { NotFoundException.of("Usuário", userId) }
        val makeDefault = request.isDefault || addressRepository.findByUserIdAndIsDefaultTrue(userId) == null
        if (makeDefault) {
            addressRepository.clearDefaultsForUser(userId)
        }
        val address = Address(
            user = user,
            label = request.label,
            recipient = request.recipient,
            street = request.street,
            number = request.number,
            complement = request.complement,
            neighborhood = request.neighborhood,
            city = request.city,
            state = request.state.uppercase(),
            postalCode = request.postalCode,
            isDefault = makeDefault,
        )
        return addressRepository.save(address)
    }

    @Transactional
    fun update(userId: UUID, addressId: UUID, request: AddressRequest): Address {
        val address = addressRepository.findByIdAndUserId(addressId, userId)
            ?: throw NotFoundException.of("Endereço", addressId)
        address.label = request.label
        address.recipient = request.recipient
        address.street = request.street
        address.number = request.number
        address.complement = request.complement
        address.neighborhood = request.neighborhood
        address.city = request.city
        address.state = request.state.uppercase()
        address.postalCode = request.postalCode
        address.updatedAt = Instant.now()
        if (request.isDefault && !address.isDefault) {
            addressRepository.clearDefaultsForUser(userId)
            address.isDefault = true
        }
        return address
    }

    @Transactional
    fun delete(userId: UUID, addressId: UUID) {
        val address = addressRepository.findByIdAndUserId(addressId, userId)
            ?: throw NotFoundException.of("Endereço", addressId)
        addressRepository.delete(address)
    }

    @Transactional
    fun setDefault(userId: UUID, addressId: UUID): Address {
        val address = addressRepository.findByIdAndUserId(addressId, userId)
            ?: throw NotFoundException.of("Endereço", addressId)
        if (!address.isDefault) {
            addressRepository.clearDefaultsForUser(userId)
            address.isDefault = true
            address.updatedAt = Instant.now()
        }
        return address
    }

    @Transactional(readOnly = true)
    fun getForUser(userId: UUID, addressId: UUID): Address =
        addressRepository.findByIdAndUserId(addressId, userId)
            ?: throw NotFoundException.of("Endereço", addressId)
}
