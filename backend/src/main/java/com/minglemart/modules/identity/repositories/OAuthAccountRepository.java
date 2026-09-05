package com.minglemart.modules.identity.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.minglemart.modules.identity.models.OAuthAccountModel;
import com.minglemart.shared.domain.BaseRepository;
import com.minglemart.shared.enums.OAuthProvider;

public interface OAuthAccountRepository extends BaseRepository<OAuthAccountModel> {

    /** The sign-in lookup — backed by the UNIQUE (provider, provider_user_id) index. */
    Optional<OAuthAccountModel> findByProviderAndProviderUserId(
            OAuthProvider provider, String providerUserId);

    Optional<OAuthAccountModel> findByUserIdAndProvider(UUID userId, OAuthProvider provider);

    List<OAuthAccountModel> findByUserId(UUID userId);
}
