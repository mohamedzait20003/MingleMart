package com.minglemart.modules.identity.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minglemart.modules.identity.models.AddressModel;
import com.minglemart.modules.identity.repositories.AddressRepository;
import com.minglemart.shared.domain.BaseDataService;

@Service
public class AddressService extends BaseDataService<AddressModel, AddressRepository> {

    public AddressService(AddressRepository repository) {
        super(repository);
    }

    @Override
    protected String entityName() {
        return "Address";
    }

    public List<AddressModel> forUser(UUID userId) {
        return repository.findByUserIdAndDeletedAtIsNull(userId);
    }

    /** Scoped by user, so one account cannot read another account address by id. */
    public Optional<AddressModel> forUser(UUID userId, UUID addressId) {
        return repository.findByIdAndUserIdAndDeletedAtIsNull(addressId, userId);
    }

    public Optional<AddressModel> defaultShipping(UUID userId) {
        return repository.findByUserIdAndDefaultShippingTrueAndDeletedAtIsNull(userId);
    }

    /* Clears the previous default before setting the new one. */
    @Transactional
    public AddressModel makeDefaultShipping(UUID userId, UUID addressId) {
        repository.findByUserIdAndDefaultShippingTrueAndDeletedAtIsNull(userId).ifPresent(current -> current.setDefaultShipping(false));
        repository.flush();

        return update(addressId, address -> address.setDefaultShipping(true));
    }

    @Transactional
    public AddressModel softDelete(UUID addressId) {
        return update(addressId, AddressModel::markDeleted);
    }
}