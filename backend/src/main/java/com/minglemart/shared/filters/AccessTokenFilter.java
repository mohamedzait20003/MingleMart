package com.minglemart.shared.filters;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import com.minglemart.shared.common.AuthCookies;
import com.minglemart.shared.contracts.AccessTokenVerifier;

/**
 * Deliberately NOT a {@code @Component}. SecurityConfig constructs it and adds
 * it to the security chain, which is the only place it should run.
 *
 * <p>As a bean it broke startup outright. It sits in the `shared` application
 * module, so Spring Modulith's observability support wrapped it in a CGLIB
 * proxy; CGLIB instantiates without running field initialisers, and
 * {@code GenericFilterBean.init} is final, so it executed on the proxy with a
 * null logger and threw. Being a bean also had Boot register it a second time
 * with the servlet container, so it ran twice per request.
 */
public class AccessTokenFilter extends OncePerRequestFilter {

    private final AccessTokenVerifier verifier;

    public AccessTokenFilter(AccessTokenVerifier verifier) {
        this.verifier = verifier;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            readAccessCookie(request).flatMap(verifier::verify).ifPresent(principal -> authenticate(principal, request));
        }

        chain.doFilter(request, response);
    }

    private void authenticate(AccessTokenVerifier.Principal principal, HttpServletRequest request) {
        var authorities = principal.role() == null ? List.<SimpleGrantedAuthority>of() : List.of(new SimpleGrantedAuthority("ROLE_" + principal.role().toUpperCase()));

        var authentication = new UsernamePasswordAuthenticationToken(principal, null, authorities);

        // Attaches the caller's IP to the security context. Cheap, and it is what
        // makes an audit entry answer "from where" as well as "by whom" - the
        // same question `actor_type` answers on every mutating table.
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private java.util.Optional<String> readAccessCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return java.util.Optional.empty();
        }

        for (Cookie cookie : cookies) {
            if (AuthCookies.ACCESS.equals(cookie.getName())) {
                return java.util.Optional.ofNullable(cookie.getValue());
            }
        }
        
        return java.util.Optional.empty();
    }
}
