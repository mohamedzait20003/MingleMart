package com.minglemart.unit.identity.services;

import com.minglemart.modules.identity.services.SessionService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.minglemart.modules.identity.common.TokenHasher;
import com.minglemart.modules.identity.models.SessionModel;
import com.minglemart.modules.identity.repositories.SessionRepository;

@ExtendWith(MockitoExtension.class)
class SessionServiceTest {

    @Mock
    SessionRepository repository;

    @InjectMocks
    SessionService sessions;

    private static SessionModel active() {
        SessionModel s = new SessionModel();
        s.setExpiresAt(Instant.now().plusSeconds(3600));
        return s;
    }

    @Test
    void looksUpByHashNotByThePlaintextToken() {
        // The column stores only a digest. Querying with the raw cookie value
        // would silently match nothing and log everyone out.
        when(repository.findByToken(any())).thenReturn(Optional.of(active()));

        sessions.resolve("plaintext-refresh-token");

        ArgumentCaptor<String> queried = ArgumentCaptor.forClass(String.class);
        verify(repository).findByToken(queried.capture());

        assertThat(queried.getValue())
                .isEqualTo(TokenHasher.hash("plaintext-refresh-token"))
                .isNotEqualTo("plaintext-refresh-token");
    }

    @Test
    void rejectsARevokedSession() {
        SessionModel revoked = active();
        revoked.setRevokedAt(Instant.now());
        when(repository.findByToken(any())).thenReturn(Optional.of(revoked));

        assertThat(sessions.resolve("token")).isEmpty();
    }

    @Test
    void rejectsAnExpiredSession() {
        SessionModel expired = new SessionModel();
        expired.setExpiresAt(Instant.now().minusSeconds(1));
        when(repository.findByToken(any())).thenReturn(Optional.of(expired));

        assertThat(sessions.resolve("token")).isEmpty();
    }

    @Test
    void treatsAMissingTokenAsNoSessionRatherThanThrowing() {
        assertThat(sessions.resolve(null)).isEmpty();
        assertThat(sessions.resolve("  ")).isEmpty();
    }
}
