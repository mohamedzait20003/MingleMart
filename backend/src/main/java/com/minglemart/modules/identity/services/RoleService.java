package com.minglemart.modules.identity.services;

import java.util.Optional;
import org.springframework.stereotype.Service;

import com.minglemart.shared.domain.BaseDataService;
import com.minglemart.modules.identity.models.RoleModel;
import com.minglemart.modules.identity.repositories.RoleRepository;

@Service
public class RoleService extends BaseDataService<RoleModel, RoleRepository> {

    public RoleService(RoleRepository repository) {
        super(repository);
    }

    @Override
    protected String entityName() {
        return "Role";
    }

    public Optional<RoleModel> findByName(String name) {
        return repository.findByName(name);
    }

    /* Registration needs a role before the user row exists, because the user row needs a role to be associated with it. */
    public RoleModel require(String name) {
        return repository.findByName(name).orElseThrow(() -> new IllegalStateException("role %s is not seeded".formatted(name)));
    }
}