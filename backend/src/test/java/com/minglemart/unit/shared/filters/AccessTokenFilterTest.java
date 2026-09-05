package com.minglemart.unit.shared.filters;

import com.minglemart.shared.filters.AccessTokenFilter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import com.minglemart.shared.common.AuthCookies;
import com.minglemart.shared.contracts.AccessTokenVerifier;

@ExtendWith(MockitoExtension.class)
class AccessTokenFilterTest {

    @Mock
    AccessTokenVerifier verifier;

    @Mock
    FilterChain chain;

    private final MockHttpServletResponse response = new MockHttpServletResponse();

    @AfterEach
    void clearContext() {
        SecurityContextHolder.clearContext();
    }

    private MockHttpServletRequest withAccessCookie(String value) {
        var request = new MockHttpServletRequest();
        request.setCookies(new Cookie(AuthCookies.ACCESS, value));
        return request;
    }

    @Test
    void authenticatesFromAValidAccessCookie() throws Exception {
        UUID userId = UUID.randomUUID();
        when(verifier.verify("good-token")).thenReturn(Optional.of(
                new AccessTokenVerifier.Principal(userId, UUID.randomUUID(), "CUSTOMER", true)));

        new AccessTokenFilter(verifier)
                .doFilter(withAccessCookie("good-token"), response, chain);

        var auth = SecurityContextHolder.getContext().getAuthentication();
        assertThat(auth).isNotNull();
        assertThat(auth.getAuthorities()).extracting(Object::toString)
                .containsExactly("ROLE_CUSTOMER");   // Spring's hasRole() prefix
        assertThat(auth.getDetails()).isNotNull();   // remote address, for auditing
        verify(chain).doFilter(any(), any());
    }

    @Test
    void leavesTheContextAnonymousWhenTheTokenIsBad() throws Exception {
        when(verifier.verify("bad-token")).thenReturn(Optional.empty());

        new AccessTokenFilter(verifier)
                .doFilter(withAccessCookie("bad-token"), response, chain);

        // The filter never rejects; authorizeHttpRequests decides what anonymous means.
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(chain).doFilter(any(), any());
    }

    @Test
    void passesThroughWhenThereAreNoCookiesAtAll() throws Exception {
        new AccessTokenFilter(verifier)
                .doFilter(new MockHttpServletRequest(), response, chain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(chain).doFilter(any(), any());
    }

    @Test
    void ignoresCookiesThatAreNotTheAccessCookie() throws Exception {
        var request = new MockHttpServletRequest();
        request.setCookies(new Cookie(AuthCookies.REFRESH, "refresh-value"));

        new AccessTokenFilter(verifier).doFilter(request, response, chain);

        // A refresh token must never authenticate a request on its own.
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    @Test
    void grantsNoAuthorityWhenTheTokenCarriesNoRole() throws Exception {
        when(verifier.verify("no-role")).thenReturn(Optional.of(
                new AccessTokenVerifier.Principal(UUID.randomUUID(), UUID.randomUUID(), null, true)));

        new AccessTokenFilter(verifier).doFilter(withAccessCookie("no-role"), response, chain);

        assertThat(SecurityContextHolder.getContext().getAuthentication().getAuthorities()).isEmpty();
    }
}
