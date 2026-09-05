package com.minglemart.modules.identity.models;

import lombok.*;
import java.util.Set;
import java.util.HashSet;
import jakarta.persistence.*;
import lombok.experimental.SuperBuilder;

import java.time.Instant;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.minglemart.shared.domain.BaseModel;

@Entity
@Table(name = "sessions")
@Getter 
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class SessionModel extends BaseModel {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserModel user;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(length = 32)
    private String deviceType;
    private String userAgent;

    @JdbcTypeCode(SqlTypes.INET)
    private String ipAddress;

    private String location;

    /** Raw session handle. Never leaves the server. */
    @Column(name = "public_user_id", nullable = false)
    private String publicUserId;

    /** Per-session salt the client-facing id is derived with. */
    @Column(name = "public_user_id_salt", nullable = false)
    private String publicUserIdSalt;

    @Column(nullable = false)
    private Instant lastUsedAt;

    @Column(nullable = false)
    private Instant expiresAt;
    private Instant revokedAt;

    public boolean isActive() {
        return revokedAt == null && expiresAt.isAfter(Instant.now());
    }
}
