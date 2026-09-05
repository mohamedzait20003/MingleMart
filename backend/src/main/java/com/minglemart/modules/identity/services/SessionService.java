package com.minglemart.modules.identity.services;

import java.util.List;
import java.util.UUID;
import java.time.Instant;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minglemart.shared.domain.BaseDataService;
import com.minglemart.modules.identity.common.TokenHasher;
import com.minglemart.modules.identity.models.SessionModel;
import com.minglemart.modules.identity.repositories.SessionRepository;


@Service
public class SessionService extends BaseDataService<SessionModel, SessionRepository> {

    public SessionService(SessionRepository repository) {
        super(repository);
    }

    @Override
    protected String entityName() {
        return "Session";
    }

    /**
     * Resolves a cookie value, rejecting revoked and expired rows.
     *
     * <p>Takes the PLAINTEXT token and hashes it before looking up, because
     * {@code sessions.token} stores only the digest. Callers keep passing the
     * cookie value they received; nothing outside this class needs to know the
     * column is hashed.
     */
    public Optional<SessionModel> resolve(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        return repository.findByToken(TokenHasher.hash(token)).filter(SessionModel::isActive);
    }

    /**
     * Replaces the stored digest during refresh rotation.
     *
     * @param plaintext the new refresh token; only its hash is persisted
     */
    @Transactional
    public SessionModel rotate(UUID sessionId, String plaintext, Instant expiresAt) {
        return update(sessionId, session -> {
            session.setToken(TokenHasher.hash(plaintext));
            session.setLastUsedAt(Instant.now());
            session.setExpiresAt(expiresAt);
        });
    }

    public List<SessionModel> activeFor(UUID userId) {
        return repository.findByUserIdAndRevokedAtIsNull(userId);
    }

    @Transactional
    public void touch(UUID sessionId) {
        update(sessionId, session -> session.setLastUsedAt(Instant.now()));
    }

    @Transactional
    public void revoke(UUID sessionId) {
        update(sessionId, session -> session.setRevokedAt(Instant.now()));
    }

    /** Sign out everywhere. Returns how many sessions were ended. */
    @Transactional
    public int revokeAll(UUID userId) {
        return repository.revokeAllForUser(userId, Instant.now());
    }

    @Transactional
    public int purgeExpired(Instant cutoff) {
        return repository.deleteExpiredBefore(cutoff);
    }
}