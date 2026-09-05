package com.minglemart.shared.config;

import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.config.Customizer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.minglemart.shared.contracts.AccessTokenVerifier;
import com.minglemart.shared.filters.AccessTokenFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    private final AccessTokenVerifier accessTokenVerifier;
    private final SecurityHandler securityHandler;
    private final List<String> allowedOrigins;

    public SecurityConfig(AccessTokenVerifier accessTokenVerifier, SecurityHandler securityHandler, @Value("${minglemart.cors.allowed-origins}") List<String> allowedOrigins) {
        this.accessTokenVerifier = accessTokenVerifier;
        this.securityHandler = securityHandler;
        this.allowedOrigins = allowedOrigins;
    }

    /**
     * The browser origins allowed to call this API with credentials.
     *
     * <p>Exact origins, never {@code *}: the session lives in cookies, the
     * frontend sends them with {@code credentials: 'include'}, and a wildcard is
     * rejected outright by browsers on a credentialed request. That rule is the
     * usual reason a "fixed" CORS setup is still blocked.
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cors = new CorsConfiguration();
        cors.setAllowedOrigins(allowedOrigins);
        cors.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        cors.setAllowedHeaders(List.of("*"));
        cors.setAllowCredentials(true);
        cors.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", cors);
        return source;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .httpBasic(basic -> basic.disable())
            .formLogin(form -> form.disable())
            .exceptionHandling(e -> e.authenticationEntryPoint(securityHandler).accessDeniedHandler(securityHandler))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/landing", "/api/deals", "/api/shop").permitAll()
                .requestMatchers(HttpMethod.GET, "/actuator/health").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/actuator/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            ).addFilterBefore(new AccessTokenFilter(accessTokenVerifier), UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
