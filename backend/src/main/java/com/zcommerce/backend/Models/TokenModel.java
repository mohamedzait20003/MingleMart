package com.zcommerce.backend.Models;

import lombok.*;
import java.time.Instant;
import jakarta.persistence.*;
import lombok.experimental.SuperBuilder;


@Entity
@Getter
@Setter
@SuperBuilder
@Table(
    name = "tokens",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_tokens_value", columnNames = "value")
    }
)
@NoArgsConstructor
@AllArgsConstructor
public class TokenModel extends BaseModel {

    @Column(name = "value", nullable = false, length = 512)
    private String value;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 30)
    private TokenType type;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_tokens_user"))
    private UserModel user;

    // ── Token type enum ──────────────────────────────────────────────────────

    public enum TokenType {
        EMAIL_VERIFICATION,
        PASSWORD_RESET
    }
}

