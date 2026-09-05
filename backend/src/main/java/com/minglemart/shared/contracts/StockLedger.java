package com.minglemart.shared.contracts;

import java.util.UUID;

public interface StockLedger {
    int availableQuantity(UUID variantId);

    ReservationRef reserve(UUID variantId, int quantity, ReservationOwner owner, UUID ownerId);
    
    void commit(ReservationRef reservation);
    void release(ReservationRef reservation);

    enum ReservationOwner {
        CART,
        ORDER
    }

    record ReservationRef(UUID id) {
    }
}
