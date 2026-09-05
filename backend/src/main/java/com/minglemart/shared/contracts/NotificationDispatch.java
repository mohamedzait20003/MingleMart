package com.minglemart.shared.contracts;

import java.util.Map;
import java.util.List;
import java.util.UUID;

import com.minglemart.shared.enums.NotificationChannel;

public interface NotificationDispatch {

    /**
     * Claims up to {@code batchSize} due messages and marks them SENDING, so a
     * second dispatcher cannot pick up the same rows.
     */
    List<Deliverable> claimPending(int batchSize);

    void markSent(UUID id, String providerMessageId);

    /** Records the failure and schedules a backed-off retry, or gives up. */
    void markFailed(UUID id, String error);

    /** Returns failed messages with attempts remaining to the queue. */
    int requeueFailed(int batchSize);

    record Deliverable(
        UUID id,
        NotificationChannel channel,
        String recipient,
        String subject,
        String templateGroup,
        String templateName,
        Map<String, String> body
    ) {}
}
