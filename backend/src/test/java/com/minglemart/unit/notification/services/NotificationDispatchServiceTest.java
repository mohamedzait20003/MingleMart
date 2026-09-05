package com.minglemart.unit.notification.services;

import com.minglemart.modules.notification.services.NotificationDispatchService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import tools.jackson.databind.ObjectMapper;

import com.minglemart.modules.notification.models.NotificationModel;
import com.minglemart.modules.notification.repositories.NotificationRepository;
import com.minglemart.shared.enums.NotificationCategory;
import com.minglemart.shared.enums.NotificationChannel;

@ExtendWith(MockitoExtension.class)
class NotificationDispatchServiceTest {

    @Mock
    NotificationRepository repository;

    NotificationDispatchService dispatch;

    @BeforeEach
    void setUp() {
        dispatch = new NotificationDispatchService(repository, new ObjectMapper());
    }

    private static NotificationModel pending() {
        NotificationModel m = new NotificationModel();
        m.setId(UUID.randomUUID());
        m.setChannel(NotificationChannel.EMAIL);
        m.setCategory(NotificationCategory.ACCOUNT);
        m.setRecipient("ada@example.test");
        m.setSubject("Verify your email");
        m.setTemplateGroup("Auth");
        m.setTemplateName("email-verification");
        m.setBody("{\"firstName\":\"Ada\"}");
        m.setStatus("PENDING");
        m.setScheduledAt(Instant.now());
        return m;
    }

    private NotificationModel captureSaved() {
        ArgumentCaptor<NotificationModel> saved = ArgumentCaptor.forClass(NotificationModel.class);
        verify(repository).save(saved.capture());
        return saved.getValue();
    }

    @Test
    void claimingMarksSendingSoASecondDispatcherSkipsTheRow() {
        NotificationModel row = pending();
        when(repository.claimDue(anyString(), any(), any())).thenReturn(List.of(row));
        when(repository.save(any())).thenAnswer(i -> i.getArgument(0));

        var claimed = dispatch.claimPending(10);

        assertThat(row.getStatus()).isEqualTo("SENDING");
        assertThat(row.getAttempts()).isEqualTo(1);
        assertThat(claimed).hasSize(1);
        assertThat(claimed.getFirst().body()).containsEntry("firstName", "Ada");
        assertThat(claimed.getFirst().templateGroup()).isEqualTo("Auth");
    }

    @Test
    void unreadableBodyStillDeliversRatherThanCrashingTheBatch() {
        NotificationModel row = pending();
        row.setBody("not json at all");
        when(repository.claimDue(anyString(), any(), any())).thenReturn(List.of(row));
        when(repository.save(any())).thenAnswer(i -> i.getArgument(0));

        assertThat(dispatch.claimPending(10).getFirst().body()).isEmpty();
    }

    @Test
    void successRecordsProviderAndTimestamp() {
        NotificationModel row = pending();
        when(repository.findById(any())).thenReturn(Optional.of(row));
        when(repository.save(any())).thenAnswer(i -> i.getArgument(0));

        dispatch.markSent(row.getId(), "smtp-123");

        NotificationModel saved = captureSaved();
        assertThat(saved.getStatus()).isEqualTo("SENT");
        assertThat(saved.getProviderMessageId()).isEqualTo("smtp-123");
        assertThat(saved.getSentAt()).isNotNull();
        assertThat(saved.getErrorMessage()).isNull();
    }

    @Test
    void failureBacksOffExponentially() {
        NotificationModel row = pending();
        row.setAttempts(3);
        Instant before = Instant.now();
        when(repository.findById(any())).thenReturn(Optional.of(row));
        when(repository.save(any())).thenAnswer(i -> i.getArgument(0));

        dispatch.markFailed(row.getId(), "connection refused");

        NotificationModel saved = captureSaved();
        assertThat(saved.getStatus()).isEqualTo("FAILED");
        assertThat(saved.getErrorMessage()).isEqualTo("connection refused");
        // attempt 3 -> 2^2 = 4 minutes
        assertThat(saved.getScheduledAt()).isAfter(before.plusSeconds(200));
    }

    @Test
    void stopsReschedulingOnceAttemptsAreExhausted() {
        NotificationModel row = pending();
        row.setAttempts(5);
        Instant original = row.getScheduledAt();
        when(repository.findById(any())).thenReturn(Optional.of(row));
        when(repository.save(any())).thenAnswer(i -> i.getArgument(0));

        dispatch.markFailed(row.getId(), "still broken");

        // No further retry: the row stays where it was.
        assertThat(captureSaved().getScheduledAt()).isEqualTo(original);
    }

    @Test
    void requeueingResetsFailuresToPending() {
        NotificationModel row = pending();
        row.setStatus("FAILED");
        when(repository.findRetryable(anyInt(), any())).thenReturn(List.of(row));
        when(repository.save(any())).thenAnswer(i -> i.getArgument(0));

        assertThat(dispatch.requeueFailed(10)).isEqualTo(1);
        assertThat(row.getStatus()).isEqualTo("PENDING");
    }
}
