package com.minglemart.modules.identity.models;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import com.minglemart.shared.domain.BaseModel;
import com.minglemart.shared.enums.OAuthProvider;

/**
 * An external identity linked to a local account.
 *
 * <p>Matched on {@code providerUserId} — the provider's immutable subject id —
 * rather than email, because an email address can be reassigned to a different
 * person while the subject id never changes hands.
 */
@Entity
@Table(name = "oauth_accounts")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class OAuthAccountModel extends BaseModel {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserModel user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private OAuthProvider provider;

    /** Google's {@code sub} claim. */
    @Column(name = "provider_user_id", nullable = false)
    private String providerUserId;

    private String email;

    @Builder.Default
    @Column(name = "email_verified")
    private boolean emailVerified = false;

    private String displayName;
    private String avatarUrl;

    /** Null for plain sign-in; set only when acting on the user's behalf. */
    private String accessToken;
    private String refreshToken;
    private Instant tokenExpiresAt;
    private String scopes;

    @Builder.Default
    private Instant linkedAt = Instant.now();

    private Instant lastUsedAt;
}
