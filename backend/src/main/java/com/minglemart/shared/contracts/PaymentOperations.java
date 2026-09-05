package com.minglemart.shared.contracts;

import com.minglemart.shared.common.ActorRef;
import com.minglemart.shared.common.Money;

import java.util.UUID;

public interface PaymentOperations {

    PaymentResult capture(CapturePayment command);

    RefundResult requestRefund(RequestRefund command);

    record CapturePayment(
        UUID orderId,
        UUID paymentMethodId,
        Money amount,
        String idempotencyKey,
        ActorRef actor
    ) {}

    record PaymentResult(UUID paymentId, String status, String clientSecret) {
    }

    record RequestRefund(
        UUID orderId,
        UUID paymentId,
        Money amount,
        String reason,
        String idempotencyKey,
    ActorRef actor
    ) {}

    record RefundResult(UUID refundId, String status) {
    }
}
