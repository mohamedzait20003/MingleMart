package com.minglemart.shared.infra;

/** A rendered message, ready for the transport to send. */
public record MailMessage(String to, String subject, String htmlBody) {
}
