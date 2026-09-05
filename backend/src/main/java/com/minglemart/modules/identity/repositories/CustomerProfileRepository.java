package com.minglemart.modules.identity.repositories;

import java.util.Optional;
import java.util.UUID;

import com.minglemart.modules.identity.models.CustomerProfileModel;
import com.minglemart.shared.domain.BaseRepository;

public interface CustomerProfileRepository extends BaseRepository<CustomerProfileModel> {

    Optional<CustomerProfileModel> findByUserId(UUID userId);

    boolean existsByUserId(UUID userId);
}
