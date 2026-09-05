package com.minglemart.shared.contracts;

import java.util.UUID;

public interface AuthNotifications {

    void emailVerification(UUID userId, String email, String firstName, String verificationUrl);

    void passwordReset(UUID userId, String email, String firstName, String resetUrl);

    void passwordChanged(UUID userId, String email, String firstName);
}
