package com.minglemart.shared.contracts;

import com.minglemart.shared.common.Money;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CatalogQuery {
        Optional<VariantSummary> findVariant(UUID variantId);
        List<ProductSummary> search(String query, int limit);
    
        record ProductSummary(
                UUID id,
                String slug,
                String name,
                String brand,
                UUID defaultVariantId
        ) {}

        record VariantSummary(
            UUID id,
            UUID productId,
            String sku,
            String name,
            Money price,
            boolean active
        ) {}
}
