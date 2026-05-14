package com.zcommerce.backend.Models;

import lombok.*;
import java.time.Instant;
import jakarta.persistence.*;
import lombok.experimental.SuperBuilder;


@Entity
@Table(
    name = "sessions",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_sessions_token", columnNames = "token")
    }
)
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class SessionModel extends BaseModel {

    @Column(name = "token", nullable = false, unique = true)
    private String token;

    @Column(name = "device_type", nullable = false, length = 50)
    private String deviceType;

    @Column(name = "location", nullable = true, length = 255)
    private String location;

    @Column(name = "last_used_at", nullable = false)
    private Instant lastUsedAt;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_sessions_user"))
    private UserModel user;
}
