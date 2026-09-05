package com.minglemart.modules.notification.services;

import java.util.Map;
import java.util.UUID;
import java.util.List;
import java.time.Instant;
import java.time.Duration;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.core.type.TypeReference;
import org.springframework.data.domain.Limit;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minglemart.shared.domain.BaseIntegrationService;
import com.minglemart.shared.contracts.NotificationDispatch;
import com.minglemart.modules.notification.models.NotificationModel;
import com.minglemart.modules.notification.repositories.NotificationRepository;

@Service
public class NotificationDispatchService extends BaseIntegrationService implements NotificationDispatch {

    private static final int MAX_ATTEMPTS = 5;
    private static final TypeReference<Map<String, String>> BODY_TYPE = new TypeReference<>() {
    };

    private final NotificationRepository notifications;
    private final ObjectMapper json;

    public NotificationDispatchService(NotificationRepository notifications, ObjectMapper json) {
        this.notifications = notifications;
        this.json = json;
    }

    /**
     * Claims and marks SENDING in one transaction, so a concurrent dispatcher
     * cannot pick the same rows up. Row locks make the claim safe; the status
     * change makes it visible.
     */
    @Override
    @Transactional
    public List<Deliverable> claimPending(int batchSize) {
        List<NotificationModel> due =
                notifications.claimDue("PENDING", Instant.now(), Limit.of(batchSize));

        return due.stream().map(row -> {
            row.setStatus("SENDING");
            row.setAttempts(row.getAttempts() + 1);
            notifications.save(row);

            return new Deliverable(
                    row.getId(),
                    row.getChannel(),
                    row.getRecipient(),
                    row.getSubject(),
                    row.getTemplateGroup(),
                    row.getTemplateName(),
                    readBody(row.getBody()));
        }).toList();
    }

    @Override
    @Transactional
    public void markSent(UUID id, String providerMessageId) {
        notifications.findById(id).ifPresent(row -> {
            row.setStatus("SENT");
            row.setProvider("smtp");
            row.setProviderMessageId(providerMessageId);
            row.setSentAt(Instant.now());
            row.setErrorMessage(null);
            notifications.save(row);
        });
    }

    @Override
    @Transactional
    public void markFailed(UUID id, String error) {
        notifications.findById(id).ifPresent(row -> {
            boolean exhausted = row.getAttempts() >= MAX_ATTEMPTS;

            row.setStatus("FAILED");
            row.setErrorMessage(error);
            if (!exhausted) {
                row.setScheduledAt(Instant.now().plus(backoff(row.getAttempts())));
            }
            notifications.save(row);

            log.warn("notification {} failed on attempt {}{}: {}",
                    id, row.getAttempts(), exhausted ? " (giving up)" : "", error);
        });
    }

    @Override
    @Transactional
    public int requeueFailed(int batchSize) {
        List<NotificationModel> retryable =
                notifications.findRetryable(MAX_ATTEMPTS, Limit.of(batchSize));

        retryable.forEach(row -> {
            row.setStatus("PENDING");
            notifications.save(row);
        });
        return retryable.size();
    }

    private Map<String, String> readBody(String raw) {
        try {
            return json.readValue(raw, BODY_TYPE);
        } catch (RuntimeException e) {
            log.warn("unreadable notification body, rendering with no data: {}", e.getMessage());
            return Map.of();
        }
    }

    private static Duration backoff(int attempt) {
        return Duration.ofMinutes(1L << Math.min(attempt - 1, 4));
    }
}
