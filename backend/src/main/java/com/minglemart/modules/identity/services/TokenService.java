package com.minglemart.modules.identity.services;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minglemart.modules.identity.models.TokensModel;
import com.minglemart.modules.identity.repositories.TokensRepository;
import com.minglemart.shared.domain.BaseDataService;
import com.minglemart.shared.enums.TokenType;

@Service
public class TokenService extends BaseDataService<TokensModel, TokensRepository> {

    public TokenService(TokensRepository repository) {
        super(repository);
    }

    @Override
    protected String entityName() {
        return "Token";
    }

    /** Returns the token only when it is both unconsumed and unexpired. */
    public Optional<TokensModel> findUsable(String token, TokenType type) {
        return repository.findByTokenAndTokenType(token, type).filter(TokensModel::isUsable);
    }

    /**
     * Marks a token spent. Callers must treat {@code false} as "already used"
     * and refuse the operation — that is what makes these single-use.
     */
    @Transactional
    public boolean consume(String token, TokenType type) {
        return findUsable(token, type).map(found -> {
            found.setConsumedAt(Instant.now());
            repository.save(found);
            return true;
        }).orElse(false);
    }

    /** Invalidates outstanding tokens of a kind before a fresh one is issued. */
    @Transactional
    public int invalidateOutstanding(UUID userId, TokenType type) {
        return repository.consumeOutstanding(userId, type, Instant.now());
    }
}