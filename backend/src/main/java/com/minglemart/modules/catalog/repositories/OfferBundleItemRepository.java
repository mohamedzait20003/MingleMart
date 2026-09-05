package com.minglemart.modules.catalog.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.minglemart.modules.catalog.models.OfferBundleItemModel;

/** Keyed by the composite (offer, variant) id the table itself uses. */
public interface OfferBundleItemRepository
        extends JpaRepository<OfferBundleItemModel, OfferBundleItemModel.Id> {

    List<OfferBundleItemModel> findByOfferId(UUID offerId);

    /** Which bundles a variant is a component of. */
    List<OfferBundleItemModel> findByVariantId(UUID variantId);
}
