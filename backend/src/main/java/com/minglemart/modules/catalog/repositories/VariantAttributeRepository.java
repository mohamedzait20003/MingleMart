package com.minglemart.modules.catalog.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.minglemart.modules.catalog.models.VariantAttributeModel;

/**
 * Extends {@code JpaRepository} rather than {@code BaseRepository}:
 * {@link VariantAttributeModel} carries no timestamps and so does not extend
 * {@code BaseModel}.
 */
public interface VariantAttributeRepository extends JpaRepository<VariantAttributeModel, UUID> {

    List<VariantAttributeModel> findByVariantId(UUID variantId);

    /** Powers faceted browsing: every colour, every size, in use right now. */
    List<VariantAttributeModel> findByNameAndValue(String name, String value);

    void deleteByVariantId(UUID variantId);
}
