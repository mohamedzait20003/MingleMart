package com.minglemart.modules.notification.services;

import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ClassUtils;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

import com.minglemart.modules.notification.models.NotificationModel;
import com.minglemart.modules.notification.repositories.NotificationRepository;
import com.minglemart.shared.enums.NotificationCategory;
import com.minglemart.shared.enums.NotificationChannel;

/**
 * Base for a notification service - one subclass per domain of messages.
 *
 * <p>The subclass name determines the template directory, with the
 * {@code NotificationService} suffix stripped: {@code AuthNotificationService}
 * reads from {@code resources/templates/Auth/}, {@code OrderNotificationService}
 * from {@code resources/templates/Order/}. Derived rather than configured, so a
 * template directory can never drift from the service that sends it.
 *
 * <p>Subclasses queue; none of them deliver. {@link #queue} writes a row inside
 * the caller's transaction, so a rolled-back business change leaves no message
 * behind and a dead mail server cannot fail the request that triggered it.
 */
public abstract class BaseNotificationService {

    private static final String SERVICE_SUFFIX = "NotificationService";

    protected final Logger log = LoggerFactory.getLogger(getClass());

    private final NotificationRepository notifications;
    private final ObjectMapper json;

    protected BaseNotificationService(NotificationRepository notifications, ObjectMapper json) {
        this.notifications = notifications;
        this.json = json;
    }

    /**
     * Template directory for this service: the class name minus the
     * {@code NotificationService} suffix, so {@code AuthNotificationService}
     * resolves to {@code templates/Auth/}.
     *
     * <p>{@code getUserClass} rather than {@code getClass} because
     * {@link #queue} is {@code @Transactional}, which makes Spring wrap this
     * bean in a CGLIB subclass. Reading the raw class name off a proxy would
     * yield {@code AuthNotificationService$$SpringCGLIB$$0} and send the
     * renderer looking for a directory that does not exist.
     */
    protected String templateGroup() {
        String name = ClassUtils.getUserClass(getClass()).getSimpleName();

        return name.endsWith(SERVICE_SUFFIX)
                ? name.substring(0, name.length() - SERVICE_SUFFIX.length())
                : name;
    }

    /**
     * Queues a message.
     *
     * @param body the data the template will be filled with, stored as JSON
     * @return the queued row's id
     */
    @Transactional
    protected UUID queue(UUID userId,
                         NotificationChannel channel,
                         NotificationCategory category,
                         String recipient,
                         String subject,
                         String templateName,
                         Map<String, String> body,
                         String sourceType,
                         UUID sourceId,
                         String idempotencyKey) {

        if (idempotencyKey != null) {
            var existing = notifications.findByIdempotencyKey(idempotencyKey);
            if (existing.isPresent()) {
                log.debug("notification {} already queued, skipping", idempotencyKey);
                return existing.get().getId();
            }
        }

        NotificationModel queued = notifications.save(NotificationModel.builder()
                .userId(userId)
                .channel(channel)
                .category(category)
                .recipient(recipient)
                .subject(subject)
                .templateGroup(templateGroup())
                .templateName(templateName)
                .body(toJson(body))
                .sourceType(sourceType)
                .sourceId(sourceId)
                .idempotencyKey(idempotencyKey)
                .status("PENDING")
                .build());

        log.debug("queued {}/{} to {}", templateGroup(), templateName, recipient);
        return queued.getId();
    }

    private String toJson(Map<String, String> body) {
        try {
            return json.writeValueAsString(body == null ? Map.of() : body);
        } catch (JacksonException e) {
            return "{}";
        }
    }
}
