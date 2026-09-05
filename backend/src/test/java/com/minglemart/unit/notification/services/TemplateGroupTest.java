package com.minglemart.unit.notification.services;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.Test;

import com.minglemart.modules.notification.services.BaseNotificationService;

/**
 * The template directory is derived from the class name, so a rename silently
 * changes where templates are read from. This pins the rule down.
 */
class TemplateGroupTest {

    static class AuthNotificationService extends BaseNotificationService {
        AuthNotificationService() { super(null, null); }
        String group() { return templateGroup(); }
    }

    static class OrderNotificationService extends BaseNotificationService {
        OrderNotificationService() { super(null, null); }
        String group() { return templateGroup(); }
    }

    /** No suffix to strip — falls back to the full simple name. */
    static class Bespoke extends BaseNotificationService {
        Bespoke() { super(null, null); }
        String group() { return templateGroup(); }
    }

    @Test
    void stripsTheNotificationServiceSuffix() {
        assertThat(new AuthNotificationService().group()).isEqualTo("Auth");
        assertThat(new OrderNotificationService().group()).isEqualTo("Order");
        assertThat(new Bespoke().group()).isEqualTo("Bespoke");
    }

    @Test
    void everyTemplateDirectoryMatchesAServiceGroup() {
        // templates/Auth/ must exist for AuthNotificationService to resolve
        assertThat(getClass().getClassLoader()
                .getResource("templates/" + new AuthNotificationService().group()
                        + "/email-verification.html"))
                .as("templates/Auth/email-verification.html")
                .isNotNull();
    }
}
