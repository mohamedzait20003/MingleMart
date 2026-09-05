package com.minglemart.modules.identity.services;

import com.minglemart.modules.identity.common.AuthException;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtAudienceValidator;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Service;

import com.minglemart.shared.domain.BaseIntegrationService;
import com.minglemart.shared.enums.OAuthProvider;

/**
 * Verifies a Google ID token and extracts the identity it asserts.
 *
 * <p>Verification is the whole point: an ID token is only evidence if its
 * signature, issuer, audience and expiry all check out. Decoding the payload
 * without verifying — which is all a naive base64 split does — would let any
 * caller sign in as anyone by hand-writing a JSON blob.
 *
 * <p>Four things are checked:
 * <ul>
 *   <li><strong>signature</strong> against Google's published JWKS, fetched and
 *       cached by {@link NimbusJwtDecoder};</li>
 *   <li><strong>issuer</strong> is Google;</li>
 *   <li><strong>audience</strong> is our own client id — without this, a token
 *       minted for a different application would be accepted;</li>
 *   <li><strong>expiry</strong>, via the default timestamp validator.</li>
 * </ul>
 *
 * <p>{@code email_verified} is checked separately: Google can assert an address
 * it has not confirmed, and trusting one would let someone claim an email they
 * do not control.
 */
@Service
public class GoogleService extends BaseIntegrationService {

    private static final String JWKS_URI = "https://www.googleapis.com/oauth2/v3/certs";
    private static final String ISSUER = "https://accounts.google.com";

    /** Identity asserted by a verified provider token. */
    public record OAuthProfile(
            OAuthProvider provider,
            String subject,
            String email,
            boolean emailVerified,
            String givenName,
            String familyName,
            String displayName,
            String pictureUrl) {
    }

    private final NimbusJwtDecoder decoder;

    public GoogleService(@Value("${minglemart.oauth.google.client-id:}") String clientId) {
        if (clientId == null || clientId.isBlank()) {
            log.warn("minglemart.oauth.google.client-id is unset - Google sign-in will reject "
                    + "every token, because audience cannot be checked.");
        }

        this.decoder = NimbusJwtDecoder.withJwkSetUri(JWKS_URI).build();

        List<OAuth2TokenValidator<Jwt>> validators = List.of(
                new JwtAudienceValidator(clientId),
                JwtValidators.createDefaultWithIssuer(ISSUER));

        this.decoder.setJwtValidator(JwtValidators.createDefaultWithValidators(validators));
    }

    /**
     * @param idToken the credential the browser received from Google Sign-In
     * @return the verified identity
     * @throws AuthException when the token fails any check
     */
    public OAuthProfile verify(String idToken) {
        Jwt jwt;

        try {
            jwt = decoder.decode(idToken);
        } catch (JwtException e) {
            log.debug("rejected Google ID token: {}", e.getMessage());
            throw AuthException.invalidGoogleToken();
        }

        if (!Boolean.TRUE.equals(jwt.getClaim("email_verified"))) {
            throw AuthException.googleEmailUnverified();
        }

        String email = jwt.getClaimAsString("email");

        if (email == null || email.isBlank()) {
            throw AuthException.invalidGoogleToken();
        }

        return new OAuthProfile(
                OAuthProvider.GOOGLE,
                jwt.getSubject(),
                email,
                true,
                jwt.getClaimAsString("given_name"),
                jwt.getClaimAsString("family_name"),
                jwt.getClaimAsString("name"),
                jwt.getClaimAsString("picture"));
    }
}
