package com.minglemart.modules.identity.repositories;

import java.util.Optional;
import java.util.UUID;

import com.minglemart.modules.identity.models.UserModel;
import com.minglemart.shared.domain.BaseRepository;

/**
 * Lookups are case-insensitive to match the {@code lower(email)} and
 * {@code lower(username)} unique indexes — a query using {@code =} would miss
 * a row the index considers a duplicate.
 */
public interface UserRepository extends BaseRepository<UserModel> {

    Optional<UserModel> findByEmailIgnoreCase(String email);

    Optional<UserModel> findByUsernameIgnoreCase(String username);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByUsernameIgnoreCase(String username);

    /** Excludes soft-deleted accounts; hits the partial index. */
    Optional<UserModel> findByIdAndDeletedAtIsNull(UUID id);

    long countByRoleName(String roleName);
}
