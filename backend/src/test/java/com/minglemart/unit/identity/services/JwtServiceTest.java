package com.minglemart.unit.identity.services;

import com.minglemart.modules.identity.services.JwtService;
import com.minglemart.modules.identity.services.TokenProperties;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import com.nimbusds.jose.jwk.source.ImmutableSecret;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.minglemart.modules.identity.models.RoleModel;
import com.minglemart.modules.identity.models.SessionModel;
import com.minglemart.modules.identity.models.UserModel;

class JwtServiceTest {

    private static final String SECRET = "a-test-signing-secret-of-at-least-32-bytes";

    private JwtService jwt;
    private UserModel user;
    private SessionModel session;

    private static TokenProperties props(String secret, Duration accessTtl) {
        return new TokenProperties(secret, accessTtl, Duration.ofDays(30), "minglemart", false);
    }

    @BeforeEach
    void setUp() {
        jwt = new JwtService(props(SECRET, Duration.ofMinutes(15)));

        RoleModel role = new RoleModel();
        role.setName("CUSTOMER");

        user = new UserModel();
        user.setId(UUID.randomUUID());
        user.setRole(role);
        user.setVerified(true);

        session = new SessionModel();
        session.setId(UUID.randomUUID());
    }

    @Test
    void refusesAShortSecret() {
        // HS256 needs >= 32 bytes; failing at startup beats signing weakly.
        assertThatThrownBy(() -> new JwtService(props("too-short", Duration.ofMinutes(15))))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("32 bytes");
    }

    @Test
    void issuesATokenCarryingTheClaimsTheFilterNeeds() {
        String token = jwt.issueAccessToken(user, session, "refresh-value");

        var principal = jwt.verify(token).orElseThrow();

        assertThat(principal.userId()).isEqualTo(user.getId());
        assertThat(principal.sessionId()).isEqualTo(session.getId());
        assertThat(principal.role()).isEqualTo("CUSTOMER");
        assertThat(principal.verified()).isTrue();
    }

    @Test
    void rejectsATokenSignedWithAnotherSecret() {
        String foreign = new JwtService(props("a-completely-different-secret-32-bytes!!", Duration.ofMinutes(15)))
                .issueAccessToken(user, session, "refresh-value");

        assertThat(jwt.verify(foreign)).isEmpty();
    }

    @Test
    void rejectsGarbage() {
        assertThat(jwt.verify("not-a-jwt")).isEmpty();
        assertThat(jwt.verify("")).isEmpty();
    }

    @Test
    void strictReadRejectsAnExpiredTokenButLenientReadAcceptsIt() {
        // Minted directly, because JwtService can only issue tokens that expire
        // in the future. iat/exp are an hour apart and both in the past, which
        // clears the 60s clock skew the strict validator allows.
        Instant past = Instant.now().minus(Duration.ofHours(2));

        var spec = new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        var encoder = new NimbusJwtEncoder(new ImmutableSecret<>(spec));

        JwtClaimsSet expiredClaims = JwtClaimsSet.builder()
                .issuer("minglemart")
                .issuedAt(past)
                .expiresAt(past.plus(Duration.ofHours(1)))
                .subject(user.getId().toString())
                .claim(JwtService.CLAIM_SESSION_ID, session.getId().toString())
                .claim(JwtService.CLAIM_ROLE, "CUSTOMER")
                .claim(JwtService.CLAIM_VERIFIED, true)
                .build();

        String expired = encoder.encode(JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(), expiredClaims)).getTokenValue();

        // An expired token must not authenticate a request...
        assertThat(jwt.verify(expired)).isEmpty();

        // ...but refresh must still be able to read it, since it having just
        // expired is the whole reason the client is refreshing.
        assertThat(jwt.readAccessTokenIgnoringExpiry(expired)).isPresent();
    }

    @Test
    void bindsTheAccessTokenToItsRefreshToken() {
        String refresh = jwt.issueRefreshToken();
        String access = jwt.issueAccessToken(user, session, refresh);

        var decoded = jwt.readAccessTokenIgnoringExpiry(access).orElseThrow();

        assertThat(jwt.tokensRelated(decoded, refresh)).isTrue();
    }

    @Test
    void rejectsAMismatchedPair() {
        // The attack this blocks: a stolen refresh token paired with an access
        // token from a different sign-in.
        String access = jwt.issueAccessToken(user, session, jwt.issueRefreshToken());
        var decoded = jwt.readAccessTokenIgnoringExpiry(access).orElseThrow();

        assertThat(jwt.tokensRelated(decoded, jwt.issueRefreshToken())).isFalse();
        assertThat(jwt.tokensRelated(decoded, null)).isFalse();
    }

    @Test
    void refreshTokensAreUnpredictable() {
        assertThat(jwt.issueRefreshToken()).isNotEqualTo(jwt.issueRefreshToken());
        assertThat(jwt.issueRefreshToken()).hasSizeGreaterThan(32);
    }

    @Test
    void theStoredHashMatchesTheClaimedHash() {
        // If these two ever diverge, refresh breaks for everyone.
        String refresh = jwt.issueRefreshToken();

        assertThat(jwt.hashRefreshToken(refresh))
                .isEqualTo(com.minglemart.modules.identity.common.TokenHasher.hash(refresh));
    }
}
