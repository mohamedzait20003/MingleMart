package com.zcommerce.backend.Repositories;

import java.util.Optional;
import com.zcommerce.backend.Models.RoleModel;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends BaseRepository<RoleModel> {

    Optional<RoleModel> findByName(String name);
}
