package com.minglemart.modules.identity.repositories;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.minglemart.shared.enums.TokenType;

import com.minglemart.modules.identity.models.TokensModel;
import com.minglemart.shared.domain.BaseRepository;

public interface TokensRepository extends BaseRepository<TokensModel> {

    Optional<TokensModel> findByToken(String token);

    Optional<TokensModel> findByTokenAndTokenType(String token, TokenType tokenType);

    /** Invalidate any outstanding token of a kind before issuing a fresh one. */
    @Modifying
    @Query("update TokensModel t set t.consumedAt = :now "
         + "where t.user.id = :userId and t.tokenType = :type and t.consumedAt is null")
    int consumeOutstanding(@Param("userId") UUID userId,
                           @Param("type") TokenType type,
                           @Param("now") Instant now);
}
