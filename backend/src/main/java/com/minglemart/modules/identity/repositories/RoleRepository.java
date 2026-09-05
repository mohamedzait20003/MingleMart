package com.minglemart.modules.identity.repositories;

import java.util.Optional;

import com.minglemart.modules.identity.models.RoleModel;
import com.minglemart.shared.domain.BaseRepository;

public interface RoleRepository extends BaseRepository<RoleModel> {

    Optional<RoleModel> findByName(String name);

    boolean existsByName(String name);
}
