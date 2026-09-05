package com.minglemart.shared.infra;

/** Delivery failed at the SMTP layer. The outbox row stays unsent and is retried. */
public class MailDeliveryException extends RuntimeException {

    public MailDeliveryException(String message, Throwable cause) {
        super(message, cause);
    }
}
