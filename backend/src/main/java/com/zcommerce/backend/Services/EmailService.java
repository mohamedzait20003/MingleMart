package com.zcommerce.backend.Services;

import java.util.Map;
import java.io.IOException;
import freemarker.template.Template;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import freemarker.template.TemplateException;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;


@Service
public class EmailService extends BaseService {

    private final JavaMailSender mailSender;
    private final FreeMarkerConfigurer freemarkerConfigurer;

    @Value("${app.email.from}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender, FreeMarkerConfigurer freemarkerConfigurer) {
        this.mailSender = mailSender;
        this.freemarkerConfigurer = freemarkerConfigurer;
    }

    // - Public API --

    public void sendVerificationEmail(String to, String username, String verificationUrl) {
        String body = buildFromTemplate("email-verification.ftl", Map.of(
            "username", username,
            "verificationUrl", verificationUrl
        ));

        sendEmail(to, "Verify your email", body);
    }

    public void sendPasswordResetEmail(String to, String username, String resetUrl) {
        String body = buildFromTemplate("password-reset.ftl", Map.of(
            "username", username,
            "resetUrl", resetUrl
        ));

        sendEmail(to, "Password Reset Request", body);
    }

    // - Core Functionality --

    private String buildFromTemplate(String templateName, Map<String, Object> model) {
        try {
            Template template = freemarkerConfigurer.getConfiguration().getTemplate(templateName);
            return FreeMarkerTemplateUtils.processTemplateIntoString(template, model);
        } catch (IOException | TemplateException e) {
            throw new RuntimeException("Failed to process email template", e);
        }
    }
    
    private void sendEmail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
