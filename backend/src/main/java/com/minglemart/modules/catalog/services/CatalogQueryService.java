package com.minglemart.modules.catalog.services;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minglemart.modules.catalog.models.ProductModel;
import com.minglemart.modules.catalog.models.ProductVariantModel;
import com.minglemart.modules.catalog.models.VariantPriceView;
import com.minglemart.modules.catalog.repositories.ProductVariantRepository;
import com.minglemart.shared.common.Money;
import com.minglemart.shared.contracts.CatalogQuery;

/**
 * The catalogue as other modules see it. Cart, order and the chat agent go
 * through this rather than touching the entities, which is what keeps them
 * ignorant of how pricing is modelled.
 */
@Service
@Transactional(readOnly = true)
public class CatalogQueryService implements CatalogQuery {

    private final ProductService products;
    private final ProductVariantRepository variants;
    private final PricingService pricing;

    public CatalogQueryService(ProductService products,
                               ProductVariantRepository variants,
                               PricingService pricing) {
        this.products = products;
        this.variants = variants;
        this.pricing = pricing;
    }

    /**
     * The price carried here is the EFFECTIVE price — what the shopper would be
     * charged now, offers included. The cart snapshots this at add time, so a
     * campaign ending later never silently reprices an open basket.
     */
    @Override
    public Optional<VariantSummary> findVariant(UUID variantId) {
        return variants.findById(variantId).map(this::toSummary);
    }

    @Override
    public List<ProductSummary> search(String query, int limit) {
        List<ProductModel> found = products.search(query, limit);
        if (found.isEmpty()) {
            return List.of();
        }

        // One query for every default variant rather than one per product.
        Map<UUID, UUID> defaults = variants
                .findByProductIdInAndDefaultVariantTrue(found.stream().map(ProductModel::getId).toList())
                .stream()
                .collect(Collectors.toMap(
                        variant -> variant.getProduct().getId(),
                        ProductVariantModel::getId));

        return found.stream()
                .map(product -> new ProductSummary(
                        product.getId(),
                        product.getSlug(),
                        product.getName(),
                        product.getBrand(),
                        defaults.get(product.getId())))
                .toList();
    }

    private VariantSummary toSummary(ProductVariantModel variant) {
        Money price = pricing.priceOf(variant.getId())
                .map(VariantPriceView::effectivePrice)
                .orElseGet(variant::listPrice);

        return new VariantSummary(
                variant.getId(),
                variant.getProduct().getId(),
                variant.getSku(),
                variant.getName(),
                price,
                variant.isActive());
    }
}
