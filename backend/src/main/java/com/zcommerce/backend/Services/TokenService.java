package com.zcommerce.backend.Services;

import java.util.UUID;
import java.time.Instant;
import java.time.Duration;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.zcommerce.backend.Models.UserModel;
import com.zcommerce.backend.Models.TokenModel;
import jakarta.persistence.EntityNotFoundException;
import com.zcommerce.backend.Repositories.TokenRepository;
import org.springframework.transaction.annotation.Transactional;


@Service
public class TokenService extends BaseService {

    private final TokenRepository tokenRepository;

    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    // - Create --

    @Transactional
    public String create(UserModel user, TokenModel.TokenType type, Duration ttl) {
        String value = UUID.randomUUID().toString();

        tokenRepository.deleteAllByUserAndType(user, type);
        TokenModel token = TokenModel.builder()
            .user(user)
            .type(type)
            .value(value)
            .expiresAt(Instant.now().plus(ttl))
            .build();
            
        tokenRepository.save(token);
        return value;
    }

    // - Finders --

    @Transactional(readOnly = true)
    public Optional<TokenModel> findByValue(String value) {
        return tokenRepository.findByValue(value);
    }

    @Transactional(readOnly = true)
    public TokenModel getByValue(String value) {
        return tokenRepository.findByValue(value)
            .orElseThrow(() -> new EntityNotFoundException("Token not found"));
    }

    // - Validation --

    @Transactional(readOnly = true)
    public TokenModel validate(String value, TokenModel.TokenType type) {
        TokenModel token = tokenRepository.findByValueAndType(value, type)
            .orElseThrow(() -> new EntityNotFoundException("Token not found or type mismatch"));
        if (token.getExpiresAt().isBefore(Instant.now()))
            throw new IllegalStateException("Token has expired");
        return token;
    }

    // - Delete --

    @Transactional
    public void delete(TokenModel token) {
        tokenRepository.delete(token);
    }

    @Transactional
    public void deleteAllByUserAndType(UserModel user, TokenModel.TokenType type) {
        tokenRepository.deleteAllByUserAndType(user, type);
    }

    @Transactional
    public void purgeExpired() {
        tokenRepository.deleteAllByExpiresAtBefore(Instant.now());
    }
}
