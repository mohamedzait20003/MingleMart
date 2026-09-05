package com.minglemart.shared.contracts;

import com.minglemart.shared.common.ActorRef;
import com.minglemart.shared.common.Money;

import java.util.List;
import java.util.UUID;

public interface CartOperations {

    CartSummary currentCart(UUID userId);

    CartSummary addItem(UUID userId, UUID variantId, int quantity, ActorRef actor);

    CartSummary updateQuantity(UUID userId, UUID variantId, int quantity, ActorRef actor);

    CartSummary removeItem(UUID userId, UUID variantId, ActorRef actor);

    record CartLine(
        UUID variantId,
        String sku,
        String name,
        int quantity,
        Money unitPrice
    ) {}

    record CartSummary(UUID cartId, List<CartLine> lines, Money total) {
    }
}
