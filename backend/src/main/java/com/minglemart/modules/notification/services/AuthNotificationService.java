package com.minglemart.modules.notification.services;

import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import tools.jackson.databind.ObjectMapper;

import com.minglemart.modules.notification.repositories.NotificationRepository;
import com.minglemart.shared.contracts.AuthNotifications;
import com.minglemart.shared.enums.NotificationCategory;
import com.minglemart.shared.enums.NotificationChannel;

/**
 * The auth emails.
 *
 * <p>Templates live in {@code resources/templates/Auth/} - this class's name
 * minus the {@code NotificationService} suffix. See
 * {@link BaseNotificationService#templateGroup()}.
 */
@Service
public class AuthNotificationService extends BaseNotificationService implements AuthNotifications {

    public AuthNotificationService(NotificationRepository notifications, ObjectMapper json) {
        super(notifications, json);
    }

    @Override
    public void emailVerification(UUID userId, String email, String firstName, String verificationUrl) {
        queue(userId,
                NotificationChannel.EMAIL,
                NotificationCategory.ACCOUNT,
                email,
                "Verify your MingleMart email",
                "email-verification",
                Map.of("firstName", firstName, "verificationUrl", verificationUrl),
                "ACCOUNT",
                userId,
                "verify-email:" + userId + ":" + verificationUrl.hashCode());
    }

    @Override
    public void passwordReset(UUID userId, String email, String firstName, String resetUrl) {
        queue(userId,
                NotificationChannel.EMAIL,
                NotificationCategory.SECURITY,
                email,
                "Reset your MingleMart password",
                "password-reset",
                Map.of("firstName", firstName, "resetUrl", resetUrl),
                "ACCOUNT",
                userId,
                "reset-password:" + userId + ":" + resetUrl.hashCode());
    }

    @Override
    public void passwordChanged(UUID userId, String email, String firstName) {
        queue(userId,
                NotificationChannel.EMAIL,
                NotificationCategory.SECURITY,
                email,
                "Your MingleMart password was changed",
                "password-changed",
                Map.of("firstName", firstName),
                "ACCOUNT",
                userId,
                null);
    }
}
