package com.zcommerce.backend.Repositories;

import java.util.Optional;
import com.zcommerce.backend.Models.UserModel;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends BaseRepository<UserModel> {

    Optional<UserModel> findByEmail(String email);

    Optional<UserModel> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}

