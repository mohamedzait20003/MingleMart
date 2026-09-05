package com.minglemart.modules.identity.services;

import java.util.UUID;
import java.util.function.Consumer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minglemart.shared.domain.BaseDataService;
import com.minglemart.modules.identity.models.UserModel;
import com.minglemart.modules.identity.models.CustomerProfileModel;
import com.minglemart.modules.identity.repositories.CustomerProfileRepository;


@Service
public class CustomerProfileService extends BaseDataService<CustomerProfileModel, CustomerProfileRepository> {

    public CustomerProfileService(CustomerProfileRepository repository) {
        super(repository);
    }

    @Override
    protected String entityName() {
        return "Profile";
    }

    @Transactional
    public CustomerProfileModel forUser(UserModel user) {
        return repository.findByUserId(user.getId()).orElseGet(() -> repository.save(CustomerProfileModel.builder().user(user).build()));
    }

    @Transactional
    public CustomerProfileModel updateFor(UserModel user, Consumer<CustomerProfileModel> change) {
        CustomerProfileModel profile = forUser(user);
        change.accept(profile);
        return repository.save(profile);
    }
}
