package com.minglemart.modules.identity.services;


import java.util.List;
import java.util.UUID;
import java.time.Instant;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minglemart.shared.enums.OAuthProvider;
import com.minglemart.shared.domain.BaseDataService;
import com.minglemart.modules.identity.models.UserModel;
import com.minglemart.modules.identity.models.OAuthAccountModel;
import com.minglemart.modules.identity.repositories.OAuthAccountRepository;

@Service
public class OAuthAccountService extends BaseDataService<OAuthAccountModel, OAuthAccountRepository> {

    public OAuthAccountService(OAuthAccountRepository repository) {
        super(repository);
    }

    @Override
    protected String entityName() {
        return "Linked account";
    }

    public Optional<OAuthAccountModel> findByProviderUser(OAuthProvider provider, String subject) {
        return repository.findByProviderAndProviderUserId(provider, subject);
    }

    public List<OAuthAccountModel> forUser(UUID userId) {
        return repository.findByUserId(userId);
    }

    /* Links the provider identity to a user, or refreshes the existing link. */
    @Transactional
    public OAuthAccountModel link(UserModel user, GoogleService.OAuthProfile profile) {
        return repository.findByProviderAndProviderUserId(profile.provider(), profile.subject()).map(existing -> {
            existing.setEmail(profile.email());
            existing.setEmailVerified(profile.emailVerified());
            existing.setDisplayName(profile.displayName());
            existing.setAvatarUrl(profile.pictureUrl());
            existing.setLastUsedAt(Instant.now());
            return repository.save(existing);
        }).orElseGet(() -> repository.save(OAuthAccountModel.builder()
            .user(user)
            .provider(profile.provider())
            .providerUserId(profile.subject())
            .email(profile.email())
            .emailVerified(profile.emailVerified())
            .displayName(profile.displayName())
            .avatarUrl(profile.pictureUrl())
            .lastUsedAt(Instant.now())
            .build()
        ));
    }
}
