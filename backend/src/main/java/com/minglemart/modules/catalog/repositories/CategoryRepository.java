package com.minglemart.modules.catalog.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.minglemart.modules.catalog.models.CategoryModel;
import com.minglemart.shared.domain.BaseRepository;

public interface CategoryRepository extends BaseRepository<CategoryModel> {

    Optional<CategoryModel> findBySlug(String slug);

    boolean existsBySlug(String slug);

    /** Top of the tree, in merchandising order. */
    List<CategoryModel> findByParentIsNullAndActiveTrueOrderByPositionAsc();

    List<CategoryModel> findByParentIdOrderByPositionAsc(UUID parentId);
}
