package com.minglemart.modules.catalog.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minglemart.modules.catalog.models.CategoryModel;
import com.minglemart.modules.catalog.models.OfferModel;
import com.minglemart.modules.catalog.models.OfferTargetModel;
import com.minglemart.modules.catalog.models.ProductModel;
import com.minglemart.modules.catalog.models.ProductVariantModel;
import com.minglemart.modules.catalog.repositories.OfferRepository;
import com.minglemart.modules.catalog.repositories.OfferTargetRepository;
import com.minglemart.modules.catalog.config.StorefrontCacheKeys;
import com.minglemart.shared.domain.BaseDataService;
import com.minglemart.shared.infra.RedisStore;

@Service
public class OfferService extends BaseDataService<OfferModel, OfferRepository> {

    private final OfferTargetRepository targets;
    private final RedisStore cache;

    public OfferService(OfferRepository repository, OfferTargetRepository targets, RedisStore cache) {
        super(repository);
        this.targets = targets;
        this.cache = cache;
    }

    @Override
    protected String entityName() {
        return "Offer";
    }

    public List<OfferModel> forDeal(UUID dealId) {
        return repository.findByDealId(dealId);
    }

    /** Markdowns that belong to no campaign. */
    public List<OfferModel> standalone() {
        return repository.findByDealIsNullAndActiveTrue();
    }

    public List<OfferTargetModel> targetsOf(UUID offerId) {
        return targets.findByOfferIdOrderByPositionAsc(offerId);
    }

    // --- targeting ---

    @Transactional
    public OfferTargetModel targetEverything(UUID offerId) {
        return attach(offerId, OfferTargetModel.all(false));
    }

    @Transactional
    public OfferTargetModel targetCategory(UUID offerId, CategoryModel category) {
        return attach(offerId, OfferTargetModel.category(category, false));
    }

    @Transactional
    public OfferTargetModel targetBrand(UUID offerId, String brand) {
        return attach(offerId, OfferTargetModel.brand(brand, false));
    }

    @Transactional
    public OfferTargetModel targetProduct(UUID offerId, ProductModel product) {
        return attach(offerId, OfferTargetModel.product(product, false));
    }

    @Transactional
    public OfferTargetModel targetVariant(UUID offerId, ProductVariantModel variant) {
        return attach(offerId, OfferTargetModel.variant(variant, false));
    }

    /** Carves a brand back out of a broader scope: "all of Footwear, except Acme". */
    @Transactional
    public OfferTargetModel excludeBrand(UUID offerId, String brand) {
        return attach(offerId, OfferTargetModel.brand(brand, true));
    }

    @Transactional
    public OfferTargetModel excludeProduct(UUID offerId, ProductModel product) {
        return attach(offerId, OfferTargetModel.product(product, true));
    }

    @Transactional
    public OfferTargetModel excludeCategory(UUID offerId, CategoryModel category) {
        return attach(offerId, OfferTargetModel.category(category, true));
    }

    @Transactional
    public void removeTarget(UUID targetId) {
        targets.deleteById(targetId);
        cache.evictByPrefix(StorefrontCacheKeys.PREFIX);
    }

    // --- allocation ---

    /**
     * Takes {@code units} out of a limited offer, or reports that they are gone.
     * The check and the write are one statement, so two checkouts racing for the
     * last unit cannot both win.
     */
    @Transactional
    public boolean claim(UUID offerId, int units) {
        if (units <= 0) {
            throw new IllegalArgumentException("units must be positive");
        }
        return repository.claimAllocation(offerId, units) == 1;
    }

    /** Puts units back when an order is cancelled. */
    @Transactional
    public void release(UUID offerId, int units) {
        if (units <= 0) {
            throw new IllegalArgumentException("units must be positive");
        }
        repository.releaseAllocation(offerId, units);
    }

    @Transactional
    public OfferModel setActive(UUID offerId, boolean active) {
        OfferModel updated = update(offerId, offer -> offer.setActive(active));
        cache.evictByPrefix(StorefrontCacheKeys.PREFIX);
        return updated;
    }

    private OfferTargetModel attach(UUID offerId, OfferTargetModel target) {
        target.setOffer(getOrThrow(offerId));
        OfferTargetModel saved = targets.save(target);

        // Retargeting an offer reprices whatever it now covers.
        cache.evictByPrefix(StorefrontCacheKeys.PREFIX);
        return saved;
    }
}
