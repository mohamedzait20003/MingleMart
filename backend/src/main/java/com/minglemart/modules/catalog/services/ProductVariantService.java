package com.minglemart.modules.catalog.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minglemart.modules.catalog.models.ProductVariantModel;
import com.minglemart.modules.catalog.repositories.ProductVariantRepository;
import com.minglemart.modules.catalog.config.StorefrontCacheKeys;
import com.minglemart.shared.domain.BaseDataService;
import com.minglemart.shared.infra.RedisStore;

@Service
public class ProductVariantService
        extends BaseDataService<ProductVariantModel, ProductVariantRepository> {

    private final RedisStore cache;

    public ProductVariantService(ProductVariantRepository repository, RedisStore cache) {
        super(repository);
        this.cache = cache;
    }

    @Override
    protected String entityName() {
        return "Variant";
    }

    public Optional<ProductVariantModel> findBySku(String sku) {
        return repository.findBySku(sku);
    }

    public boolean skuTaken(String sku) {
        return repository.existsBySku(sku);
    }

    public List<ProductVariantModel> forProduct(UUID productId) {
        return repository.findByProductIdOrderBySkuAsc(productId);
    }

    public List<ProductVariantModel> sellableFor(UUID productId) {
        return repository.findByProductIdAndActiveTrue(productId);
    }

    public Optional<ProductVariantModel> defaultFor(UUID productId) {
        return repository.findByProductIdAndDefaultVariantTrue(productId);
    }

    /**
     * Clears the previous default before setting the new one, and flushes in
     * between: {@code ux_variants_default} allows only one per product, so
     * writing both in one flush would collide.
     */
    @Transactional
    public ProductVariantModel makeDefault(UUID variantId) {
        ProductVariantModel variant = getOrThrow(variantId);

        repository.findByProductIdAndDefaultVariantTrue(variant.getProduct().getId())
                .filter(current -> !current.getId().equals(variantId))
                .ifPresent(current -> current.setDefaultVariant(false));
        repository.flush();

        variant.setDefaultVariant(true);
        ProductVariantModel promoted = repository.save(variant);

        // The default variant is the one every card prices and links to.
        cache.evictByPrefix(StorefrontCacheKeys.PREFIX);
        return promoted;
    }

    @Transactional
    public ProductVariantModel setActive(UUID variantId, boolean active) {
        ProductVariantModel updated = update(variantId, variant -> variant.setActive(active));
        cache.evictByPrefix(StorefrontCacheKeys.PREFIX);
        return updated;
    }
}
