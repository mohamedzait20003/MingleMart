package com.minglemart.modules.identity.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.minglemart.modules.identity.models.PermissionModel;
import com.minglemart.modules.identity.repositories.PermissionRepository;
import com.minglemart.shared.domain.BaseDataService;

@Service
public class PermissionService extends BaseDataService<PermissionModel, PermissionRepository> {

    public PermissionService(PermissionRepository repository) {
        super(repository);
    }

    @Override
    protected String entityName() {
        return "Permission";
    }

    public Optional<PermissionModel> findByName(String name) {
        return repository.findByName(name);
    }
}