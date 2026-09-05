package com.minglemart.shared.contracts;

import com.minglemart.shared.common.ActorRef;
import com.minglemart.shared.common.Money;

import java.util.Optional;
import java.util.UUID;

public interface OrderOperations {
    OrderSummary place(PlaceOrder command);
    Optional<OrderSummary> findByNumber(String orderNumber);

    void cancel(UUID orderId, String reason, ActorRef actor);

    record PlaceOrder(
        UUID userId,
        UUID cartId,
        UUID shippingAddressId,
        UUID billingAddressId,
        String idempotencyKey,
        ActorRef actor
    ) {}

    record OrderSummary(UUID id, String orderNumber, String status, Money total) {
    }
}
