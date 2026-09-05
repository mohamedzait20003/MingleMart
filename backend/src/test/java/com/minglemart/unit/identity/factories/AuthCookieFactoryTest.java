package com.minglemart.unit.identity.factories;

import java.util.UUID;
import java.time.Duration;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.assertj.core.api.Assertions.assertThat;

import com.minglemart.modules.identity.models.RoleModel;
import com.minglemart.modules.identity.models.UserModel;
import com.minglemart.modules.identity.services.TokenProperties;
import com.minglemart.modules.identity.factories.AuthCookieFactory;

class AuthCookieFactoryTest {

    private AuthCookieFactory cookies;
    private UserModel user;

    @BeforeEach
    void setUp() {
        cookies = new AuthCookieFactory(new TokenProperties("a-test-signing-secret-of-at-least-32-bytes", Duration.ofMinutes(15), Duration.ofDays(30), "minglemart", true));

        RoleModel role = new RoleModel();
        role.setName("ADMIN");

        user = new UserModel();
        user.setId(UUID.randomUUID());
        user.setRole(role);
        user.setVerified(true);
    }

    @Test
    void accessCookieIsHttpOnlyAndSiteWide() {
        var cookie = cookies.access("jwt-value");

        assertThat(cookie.isHttpOnly()).isTrue();
        assertThat(cookie.getPath()).isEqualTo("/");
        assertThat(cookie.getMaxAge()).isEqualTo(Duration.ofMinutes(15));
    }

    @Test
    void refreshCookieIsScopedToTheAuthEndpoints() {
        // Not sent on requests that cannot use it, which shrinks its exposure.
        var cookie = cookies.refresh("opaque-value");

        assertThat(cookie.isHttpOnly()).isTrue();
        assertThat(cookie.getPath()).isEqualTo("/api/auth");
    }

    @Test
    void sessionCookieIsReadableByTheFrontend() {
        // The route guards parse this one; it must NOT be HttpOnly.
        var cookie = cookies.session(user, "abc123handle");

        assertThat(cookie.isHttpOnly()).isFalse();
        assertThat(cookie.getPath()).isEqualTo("/");
    }

    @Test
    void sessionCookieCarriesRoleAndVerifiedOnly() {
        // Never a token: this one is readable by any script on the page.
        String value = java.net.URLDecoder.decode(cookies.session(user, "abc123handle").getValue(), java.nio.charset.StandardCharsets.UTF_8);

        assertThat(value)
                .contains("\"role\":\"ADMIN\"")
                .contains("\"isVerified\":true")
                // The SSR guard reads the handle from here to build URL prefixes.
                .contains("\"publicUserId\":\"abc123handle\"");
        // Readable by any script on the page, so it must carry no credential.
        assertThat(value).doesNotContain("token").doesNotContain("proof");
    }

    @Test
    void secureFlagFollowsConfiguration() {
        assertThat(cookies.access("v").isSecure()).isTrue();
    }

    @Test
    void clearingExpiresAllThree() {
        var cleared = cookies.clearAll();

        assertThat(cleared).hasSize(3);
        assertThat(cleared).allSatisfy(c -> assertThat(c.getMaxAge()).isZero());
    }
}
