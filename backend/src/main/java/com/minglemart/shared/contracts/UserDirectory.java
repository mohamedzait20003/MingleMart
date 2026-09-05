package com.minglemart.shared.contracts;

import java.util.Optional;
import java.util.UUID;

public interface UserDirectory {

    Optional<UserSummary> findById(UUID userId);

    boolean isActive(UUID userId);

    record UserSummary(
            UUID id,
            String email,
            String displayName,
            boolean verified,
            boolean agentEnabled) {
    }
}
