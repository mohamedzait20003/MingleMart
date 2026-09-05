package com.minglemart.modules.catalog.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.minglemart.modules.catalog.models.ProductModel;
import com.minglemart.shared.domain.BaseRepository;
import com.minglemart.shared.enums.ProductStatus;

public interface ProductRepository extends BaseRepository<ProductModel> {

    Optional<ProductModel> findBySlug(String slug);

    boolean existsBySlug(String slug);

    Page<ProductModel> findByStatus(ProductStatus status, Pageable pageable);

    Page<ProductModel> findByCategoryIdAndStatus(UUID categoryId, ProductStatus status, Pageable pageable);

    /**
     * Full-text search over the trigger-maintained {@code search_vector}, ranked
     * by relevance. Native because {@code tsvector} has no JPQL equivalent, and
     * because this is the query the gin index exists for.
     *
     * <p>{@code plainto_tsquery} treats the input as words rather than as
     * operator syntax, so a shopper typing "shoes & socks" gets a search instead
     * of a parse error.
     */
    @Query(value = """
            SELECT p.* FROM products p
            WHERE  p.status = 'ACTIVE'
              AND  p.search_vector @@ plainto_tsquery('simple', :term)
            ORDER  BY ts_rank(p.search_vector, plainto_tsquery('simple', :term)) DESC,
                      p.name ASC
            LIMIT  :limit
            """, nativeQuery = true)
    List<ProductModel> search(@Param("term") String term, @Param("limit") int limit);

    /**
     * Live product counts per category, counting the whole subtree beneath each
     * one. A storefront tile says "Apparel", but the products are filed under
     * its children — counting only direct members would show every parent
     * category as empty.
     *
     * <p>Native because it walks {@code category_tree}, and grouped rather than
     * counted per category: one query, not one per department.
     */
    @Query(value = """
            SELECT ct.ancestor_id AS category_id, count(*) AS total
            FROM   products p
            JOIN   category_tree ct ON ct.descendant_id = p.category_id
            WHERE  p.status = 'ACTIVE'
            GROUP  BY ct.ancestor_id
            """, nativeQuery = true)
    List<CategoryCount> countActiveByCategory();

    interface CategoryCount {
        UUID getCategoryId();

        long getTotal();
    }
}
