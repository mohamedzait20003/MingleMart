package com.minglemart.unit.notification.services;

import com.minglemart.modules.notification.services.AuthNotificationService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
class AuthNotificationServiceTest {

    @Mock
    NotificationRepository repository;

    AuthNotificationService service;

    @BeforeEach
    void setUp() {
        service = new AuthNotificationService(repository, new ObjectMapper());
    }

    private NotificationModel captureQueued() {
        ArgumentCaptor<NotificationModel> saved = ArgumentCaptor.forClass(NotificationModel.class);
        verify(repository).save(saved.capture());
        return saved.getValue();
    }

    @Test
    void queuesAVerificationEmailWithTheDataTheTemplateNeeds() {
        when(repository.findByIdempotencyKey(anyString())).thenReturn(Optional.empty());
        when(repository.save(any())).thenAnswer(i -> {
            NotificationModel m = i.getArgument(0);
            m.setId(UUID.randomUUID());
            return m;
        });

        UUID user = UUID.randomUUID();
        service.emailVerification(user, "ada@example.test", "Ada", "https://example.test/verify?t=1");

        NotificationModel queued = captureQueued();

        assertThat(queued.getRecipient()).isEqualTo("ada@example.test");
        assertThat(queued.getChannel()).isEqualTo(NotificationChannel.EMAIL);
        assertThat(queued.getCategory()).isEqualTo(NotificationCategory.ACCOUNT);
        assertThat(queued.getStatus()).isEqualTo("PENDING");
        // Directory is derived from the class name minus its suffix.
        assertThat(queued.getTemplateGroup()).isEqualTo("Auth");
        assertThat(queued.getTemplateName()).isEqualTo("email-verification");
        // The body carries data, never rendered HTML.
        assertThat(queued.getBody()).contains("Ada").contains("verificationUrl")
                .doesNotContain("<html");
    }

    @Test
    void passwordResetIsASecurityMessage() {
        when(repository.findByIdempotencyKey(anyString())).thenReturn(Optional.empty());
        when(repository.save(any())).thenAnswer(i -> i.getArgument(0));

        service.passwordReset(UUID.randomUUID(), "ada@example.test", "Ada", "https://example.test/r");

        assertThat(captureQueued().getCategory()).isEqualTo(NotificationCategory.SECURITY);
    }

    @Test
    void doesNotQueueTheSameMessageTwice() {
        // The redelivery guard: a repeated trigger returns the original row.
        NotificationModel existing = new NotificationModel();
        existing.setId(UUID.randomUUID());
        when(repository.findByIdempotencyKey(anyString())).thenReturn(Optional.of(existing));

        service.emailVerification(UUID.randomUUID(), "ada@example.test", "Ada", "https://example.test/v");

        verify(repository, never()).save(any());
    }
}
