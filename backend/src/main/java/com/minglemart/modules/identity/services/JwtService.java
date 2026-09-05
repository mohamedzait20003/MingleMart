package com.minglemart.modules.identity.services;

import java.util.UUID;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Base64;
import java.time.Instant;
import java.util.Optional;
import java.security.SecureRandom;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Service;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;

import com.minglemart.modules.identity.models.UserModel;
import com.minglemart.modules.identity.common.TokenHasher;
import com.minglemart.modules.identity.models.SessionModel;
import com.minglemart.shared.contracts.AccessTokenVerifier;
import com.minglemart.shared.domain.BaseIntegrationService;

@Service
public class JwtService extends BaseIntegrationService implements AccessTokenVerifier {
    public static final String CLAIM_ROLE = "role";
    public static final String CLAIM_SESSION_ID = "sid";
    public static final String CLAIM_VERIFIED = "verified";
    public static final String CLAIM_REFRESH_HASH = "rth";


    private static final SecureRandom RANDOM = new SecureRandom();

    private final TokenProperties properties;
    private final NimbusJwtEncoder encoder;
    private final NimbusJwtDecoder decoder;
    private final NimbusJwtDecoder expiryAgnosticDecoder;

    public JwtService(TokenProperties properties) {
        this.properties = properties;

        byte[] key = properties.secret().getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (key.length < 32) {
            throw new IllegalStateException("minglemart.token.secret must be at least 32 bytes for HS256");
        }

        SecretKeySpec spec = new SecretKeySpec(key, "HmacSHA256");
        this.encoder = new NimbusJwtEncoder(new ImmutableSecret<>(spec));
        this.decoder = NimbusJwtDecoder.withSecretKey(spec).macAlgorithm(MacAlgorithm.HS256).build();

        this.expiryAgnosticDecoder = NimbusJwtDecoder.withSecretKey(spec).macAlgorithm(MacAlgorithm.HS256).build();
        this.expiryAgnosticDecoder.setJwtValidator(token -> OAuth2TokenValidatorResult.success());
    }

    // --- access token ---

    public String issueAccessToken(UserModel user, SessionModel session, String refreshToken) {
        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer(properties.issuer())
            .issuedAt(now)
            .expiresAt(now.plus(properties.accessTtl()))
            .subject(user.getId().toString())
            .id(randomToken(16))
            .claim(CLAIM_SESSION_ID, session.getId().toString())
            .claim(CLAIM_ROLE, user.getRole() != null ? user.getRole().getName() : null)
            .claim(CLAIM_VERIFIED, user.isVerified())
            // Binds this access token to the refresh token issued with it.
            // Without this claim tokensRelated() always fails and refresh is dead.
            .claim(CLAIM_REFRESH_HASH, hashRefreshToken(refreshToken))
            .build();

        return encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();
    }

    public Optional<Jwt> readAccessToken(String token) {
        try {
            return Optional.of(decoder.decode(token));
        } catch (JwtException e) {
            log.debug("rejected access token: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<UUID> subjectOf(Jwt jwt) {
        try {
            return Optional.of(UUID.fromString(jwt.getSubject()));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    // --- refresh token ---

    public String issueRefreshToken() {
        return randomToken(32);
    }

    public boolean tokensRelated(Jwt accessToken, String refreshToken) {
        String claimed = accessToken.getClaimAsString(CLAIM_REFRESH_HASH);

        if (claimed == null || refreshToken == null) {
            return false;
        }

        return MessageDigest.isEqual(claimed.getBytes(StandardCharsets.UTF_8), hashRefreshToken(refreshToken).getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Verifies a token and lifts its claims into a {@link Principal}.
     *
     * <p>This is the security filter's entire view of the caller. Signature and
     * expiry are checked; nothing is read from the database.
     */
    @Override
    public Optional<Principal> verify(String accessToken) {
        return readAccessToken(accessToken).flatMap(jwt -> subjectOf(jwt).map(userId -> {
            String rawSessionId = jwt.getClaimAsString(CLAIM_SESSION_ID);

            return new Principal(
                    userId,
                    rawSessionId != null ? UUID.fromString(rawSessionId) : null,
                    jwt.getClaimAsString(CLAIM_ROLE),
                    Boolean.TRUE.equals(jwt.getClaim(CLAIM_VERIFIED)));
        }));
    }

    /* Reads an access token WITHOUT enforcing expiry. */
    public Optional<Jwt> readAccessTokenIgnoringExpiry(String token) {
        try {
            return Optional.of(expiryAgnosticDecoder.decode(token));
        } catch (JwtException e) {
            log.debug("rejected access token (expiry ignored): {}", e.getMessage());
            return Optional.empty();
        }
    }

    /** Delegates to {@link TokenHasher} so the JWT claim and the stored digest
     *  are produced by the same function - they must match exactly. */
    public String hashRefreshToken(String refreshToken) {
        return TokenHasher.hash(refreshToken);
    }

    public Instant refreshExpiry() {
        return Instant.now().plus(properties.refreshTtl());
    }

    public TokenProperties properties() {
        return properties;
    }

    private static String randomToken(int bytes) {
        byte[] buffer = new byte[bytes];
        RANDOM.nextBytes(buffer);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(buffer);
    }
}
