package com.minglemart.jobs;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.minglemart.shared.contracts.NotificationDispatch;
import com.minglemart.shared.infra.MailMessage;
import com.minglemart.shared.infra.SmtpMailSender;
import com.minglemart.shared.infra.TemplateRenderer;

/**
 * Drains the notification outbox: claim, render, send, settle.
 *
 * <p>Lives outside {@code modules} because a job is a trigger, not a feature.
 * It owns delivery mechanics; the notification module owns the rows. That split
 * is enforced by {@code allowedDependencies = "shared"} on this package - the
 * three things below are all in {@code shared}, and nothing here can reach into
 * {@code notification}.
 *
 * <p>Safe to run on several instances: the claim locks rows and flips them to
 * SENDING, so no two dispatchers pick up the same message.
 */
@Component
public class NotificationDispatchJob {

    private static final Logger log = LoggerFactory.getLogger(NotificationDispatchJob.class);

    private static final int BATCH_SIZE = 50;
    private static final int RETRY_BATCH_SIZE = 25;

    private final NotificationDispatch dispatch;
    private final TemplateRenderer templates;
    private final SmtpMailSender mail;

    public NotificationDispatchJob(NotificationDispatch dispatch,
                                   TemplateRenderer templates,
                                   SmtpMailSender mail) {
        this.dispatch = dispatch;
        this.templates = templates;
        this.mail = mail;
    }

    @Scheduled(fixedDelayString = "${minglemart.jobs.notifications.dispatch-interval:15s}")
    public void dispatch() {
        List<NotificationDispatch.Deliverable> batch = dispatch.claimPending(BATCH_SIZE);

        if (batch.isEmpty()) {
            return;
        }

        int sent = 0;
        for (NotificationDispatch.Deliverable message : batch) {
            if (deliver(message)) {
                sent++;
            }
        }

        log.info("dispatched {}/{} notification(s)", sent, batch.size());
    }

    /**
     * Rendering happens here, not at queue time, so editing a template changes
     * what an already-queued message will say.
     */
    private boolean deliver(NotificationDispatch.Deliverable message) {
        try {
            String html = templates.render(
                    message.templateGroup(), message.templateName(), message.body());

            String providerId = mail.send(
                    new MailMessage(message.recipient(), message.subject(), html));

            dispatch.markSent(message.id(), providerId);
            return true;

        } catch (RuntimeException e) {
            // Covers a missing template as well as a refused send: both mean this
            // message cannot go out right now, and both deserve a retry.
            dispatch.markFailed(message.id(), e.getMessage());
            return false;
        }
    }

    /**
     * Re-queues failures with attempts remaining. Separate from the dispatch
     * loop so a provider outage does not spend the whole retry budget at once.
     */
    @Scheduled(fixedDelayString = "${minglemart.jobs.notifications.retry-interval:5m}")
    public void retry() {
        int requeued = dispatch.requeueFailed(RETRY_BATCH_SIZE);

        if (requeued > 0) {
            log.info("re-queued {} failed notification(s)", requeued);
        }
    }
}
