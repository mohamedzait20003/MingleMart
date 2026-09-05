package com.minglemart.modules.identity.repositories;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import com.minglemart.modules.identity.models.PermissionModel;
import com.minglemart.shared.domain.BaseRepository;

public interface PermissionRepository extends BaseRepository<PermissionModel> {

    Optional<PermissionModel> findByName(String name);

    List<PermissionModel> findByNameIn(Collection<String> names);
}
