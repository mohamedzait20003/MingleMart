package com.minglemart.modules.catalog.services;

import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minglemart.modules.catalog.config.StorefrontCacheKeys;
import com.minglemart.modules.catalog.dtos.LandingResponse;
import com.minglemart.modules.catalog.dtos.ShopResponse;
import com.minglemart.modules.catalog.models.CategoryModel;
import com.minglemart.modules.catalog.repositories.CategoryRepository;
import com.minglemart.modules.catalog.repositories.ProductRepository;
import com.minglemart.shared.domain.BaseDataService;
import com.minglemart.shared.infra.RedisStore;

@Service
public class CategoryService extends BaseDataService<CategoryModel, CategoryRepository> {

    private final ProductRepository products;
    private final RedisStore cache;

    public CategoryService(CategoryRepository repository, ProductRepository products, RedisStore cache) {
        super(repository);
        this.products = products;
        this.cache = cache;
    }

    @Override
    protected String entityName() {
        return "Category";
    }

    public Optional<CategoryModel> findBySlug(String slug) {
        return repository.findBySlug(slug);
    }

    public boolean slugTaken(String slug) {
        return repository.existsBySlug(slug);
    }

    public List<CategoryModel> roots() {
        return repository.findByParentIsNullAndActiveTrueOrderByPositionAsc();
    }

    public List<CategoryModel> children(UUID parentId) {
        return repository.findByParentIdOrderByPositionAsc(parentId);
    }

    // ---------------------------------------------------------- storefront ---

    /**
     * The department tiles on the home page, each counted over its whole
     * subtree — products live in leaf categories, so counting direct members
     * would show every department as empty.
     */
    public List<LandingResponse.CategoryTile> tiles() {
        Optional<List<LandingResponse.CategoryTile>> hit =
                cache.getList(StorefrontCacheKeys.CATEGORY_TILES, LandingResponse.CategoryTile.class);
        if (hit.isPresent()) {
            return hit.get();
        }

        Map<UUID, Long> counts = productCounts();
        List<LandingResponse.CategoryTile> tiles = roots().stream()
                .map(category -> new LandingResponse.CategoryTile(
                        category.getId(),
                        category.getSlug(),
                        category.getName(),
                        category.getDescription(),
                        counts.getOrDefault(category.getId(), 0L)))
                .toList();

        cache.set(StorefrontCacheKeys.CATEGORY_TILES, tiles, StorefrontCacheKeys.CATEGORIES_TTL);
        return tiles;
    }

    /** The shop's filter rail. Counts are catalogue-wide, not per current query. */
    public List<ShopResponse.CategoryFacet> facets() {
        Optional<List<ShopResponse.CategoryFacet>> hit =
                cache.getList(StorefrontCacheKeys.CATEGORY_FACETS, ShopResponse.CategoryFacet.class);
        if (hit.isPresent()) {
            return hit.get();
        }

        Map<UUID, Long> counts = productCounts();
        List<ShopResponse.CategoryFacet> facets = repository.findAll().stream()
                .filter(CategoryModel::isActive)
                .map(category -> new ShopResponse.CategoryFacet(
                        category.getId(),
                        category.getSlug(),
                        category.getName(),
                        counts.getOrDefault(category.getId(), 0L)))
                .sorted(Comparator.comparing(ShopResponse.CategoryFacet::name))
                .toList();

        cache.set(StorefrontCacheKeys.CATEGORY_FACETS, facets, StorefrontCacheKeys.CATEGORIES_TTL);
        return facets;
    }

    /** Slugs by id, so a card built from a view can link into a filtered shop. */
    public Map<UUID, String> slugsOf(Collection<UUID> categoryIds) {
        if (categoryIds.isEmpty()) {
            return Map.of();
        }

        return repository.findAllById(categoryIds).stream()
                .collect(Collectors.toMap(CategoryModel::getId, CategoryModel::getSlug));
    }

    public List<CategoryModel> byIds(Collection<UUID> categoryIds) {
        return categoryIds.isEmpty() ? List.of() : repository.findAllById(categoryIds);
    }

    private Map<UUID, Long> productCounts() {
        return products.countActiveByCategory().stream()
                .collect(Collectors.toMap(
                        ProductRepository.CategoryCount::getCategoryId,
                        ProductRepository.CategoryCount::getTotal));
    }

    // -------------------------------------------------------------- writes ---

    /**
     * Rejects a parent that is the category itself. Deeper cycles are still
     * possible by hand; {@code category_tree} caps its recursion at 8 levels so
     * one cannot hang a query.
     */
    @Transactional
    public CategoryModel reparent(UUID categoryId, CategoryModel parent) {
        if (parent != null && categoryId.equals(parent.getId())) {
            throw new IllegalArgumentException("a category cannot be its own parent");
        }
        CategoryModel moved = update(categoryId, category -> category.setParent(parent));
        // Moving a category re-cuts the subtree counts on every tile.
        cache.evictByPrefix(StorefrontCacheKeys.PREFIX);
        return moved;
    }

    @Transactional
    public CategoryModel setActive(UUID categoryId, boolean active) {
        CategoryModel updated = update(categoryId, category -> category.setActive(active));
        cache.evictByPrefix(StorefrontCacheKeys.PREFIX);
        return updated;
    }
}
