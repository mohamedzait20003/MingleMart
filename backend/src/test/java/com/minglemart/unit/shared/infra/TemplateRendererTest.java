package com.minglemart.unit.shared.infra;

import com.minglemart.shared.infra.TemplateRenderer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.Map;

import org.junit.jupiter.api.Test;

class TemplateRendererTest {

    private final TemplateRenderer renderer = new TemplateRenderer();

    @Test
    void fillsPlaceholdersFromTheBody() {
        String html = renderer.render("Auth", "email-verification",
                Map.of("firstName", "Ada", "verificationUrl", "https://example.test/verify?token=abc"));

        assertThat(html)
                .contains("Ada")
                .contains("https://example.test/verify?token=abc")
                .doesNotContain("{{");
    }

    @Test
    void missingTemplateFailsLoudly() {
        // A permanent failure, not a transient one - retrying never helps.
        assertThatThrownBy(() -> renderer.render("Auth", "does-not-exist", Map.of()))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("templates/Auth/does-not-exist.html");
    }

    @Test
    void anAbsentVariableLeavesItsPlaceholder() {
        // Visible in the sent mail rather than silently blank, so it gets noticed.
        String html = renderer.render("Auth", "password-reset", Map.of("firstName", "Ada"));

        assertThat(html).contains("Ada").contains("{{resetUrl}}");
    }

    @Test
    void everyAuthTemplateResolves() {
        for (String name : new String[] {"email-verification", "password-reset", "password-changed"}) {
            assertThat(renderer.render("Auth", name, Map.of()))
                    .as(name)
                    .contains("<!doctype html>");
        }
    }
}
