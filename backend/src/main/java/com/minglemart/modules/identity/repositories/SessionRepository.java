package com.minglemart.modules.identity.repositories;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.minglemart.modules.identity.models.SessionModel;
import com.minglemart.shared.domain.BaseRepository;

public interface SessionRepository extends BaseRepository<SessionModel> {

    /** The cookie lookup on every request — backed by the UNIQUE index on token. */
    Optional<SessionModel> findByToken(String token);

    List<SessionModel> findByUserIdAndRevokedAtIsNull(UUID userId);

    /** Housekeeping/admin lookup by the raw handle. */
    Optional<SessionModel> findByPublicUserId(String publicUserId);

    /** Sign-out-everywhere. Bulk update, so callers must clear the persistence context. */
    @Modifying
    @Query("update SessionModel s set s.revokedAt = :now "
         + "where s.user.id = :userId and s.revokedAt is null")
    int revokeAllForUser(@Param("userId") UUID userId, @Param("now") Instant now);

    /** Housekeeping: drop sessions that expired before the cutoff. */
    @Modifying
    @Query("delete from SessionModel s where s.expiresAt < :cutoff")
    int deleteExpiredBefore(@Param("cutoff") Instant cutoff);
}
