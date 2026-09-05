package com.minglemart.modules.notification.models;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.minglemart.shared.domain.BaseModel;
import com.minglemart.shared.enums.NotificationCategory;
import com.minglemart.shared.enums.NotificationChannel;

/**
 * A queued message. Doubles as the delivery outbox.
 *
 * <p>The row holds everything needed to BUILD the message later, not the built
 * message: recipient, subject, which template, and {@code body} - the data the
 * template is filled with. Rendering happens in the dispatcher, so changing copy
 * changes what an unsent message will say.
 *
 * <p>{@code userId} is a plain column, not a {@code @ManyToOne} to identity:
 * notification holds no compile-time reference to another module's entity. Same
 * reasoning as {@code sourceType}/{@code sourceId}.
 */
@Entity
@Table(name = "notifications")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationModel extends BaseModel {

    @Column(name = "user_id")
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private NotificationChannel channel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private NotificationCategory category;

    /** Destination: email address, phone, device token. */
    @Column(nullable = false)
    private String recipient;

    @Column(nullable = false)
    private String subject;

    /**
     * The message data, as JSON. Everything the template needs and nothing
     * more - never rendered HTML.
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private String body;

    /** Directory under resources/templates/, the queueing service's name. */
    @Column(name = "template_group", nullable = false, length = 64)
    private String templateGroup;

    @Column(name = "template_name", nullable = false, length = 64)
    private String templateName;

    @Builder.Default
    @Column(nullable = false, length = 16)
    private String status = "PENDING";

    private String provider;

    @Column(name = "provider_message_id")
    private String providerMessageId;

    @Column(name = "source_type", length = 24)
    private String sourceType;

    @Column(name = "source_id")
    private UUID sourceId;

    /** UNIQUE. Stops a redelivered trigger mailing the same thing twice. */
    @Column(name = "idempotency_key", length = 128)
    private String idempotencyKey;

    @Builder.Default
    @Column(nullable = false)
    private int attempts = 0;

    @Column(name = "error_message")
    private String errorMessage;

    @Builder.Default
    @Column(name = "scheduled_at", nullable = false)
    private Instant scheduledAt = Instant.now();

    @Column(name = "sent_at")
    private Instant sentAt;
}
