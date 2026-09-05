package com.minglemart.modules.catalog.repositories;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import com.minglemart.modules.catalog.models.VariantPriceView;

/**
 * Reads the {@code variant_effective_prices} view.
 *
 * <p>A plain {@code Repository} rather than {@code JpaRepository}: a view has
 * nothing to save or delete, and inheriting those methods would advertise
 * writes that can only fail at the database.
 */
public interface VariantPriceRepository extends Repository<VariantPriceView, UUID> {

    Optional<VariantPriceView> findByVariantId(UUID variantId);

    /** One round trip for a whole cart or results page. */
    List<VariantPriceView> findByVariantIdIn(Collection<UUID> variantIds);

    List<VariantPriceView> findByProductId(UUID productId);

    /** Discounted variants of one product, for a "was/now" badge on the grid. */
    List<VariantPriceView> findByProductIdAndOnOfferTrue(UUID productId);

    /**
     * A page of the shop grid: one card per product, filtered and ordered by the
     * price a shopper would actually pay.
     *
     * <p>Rooted at the view rather than at products because both the price
     * filter and the price sort have to see the discounted figure — ordering by
     * {@code product_variants.price_amount} would put a heavily discounted item
     * in the wrong place the moment a campaign starts.
     *
     * <p>Native for three reasons: the full-text match has no JPQL equivalent,
     * the view is not an association, and the ordering has to switch on a
     * parameter. Each optional filter is guarded by a NULL check on its own
     * parameter, and the casts are what let Postgres infer the type of a
     * parameter that only ever appears in an IS NULL test.
     *
     * <p>Categories arrive as a comma-separated string rather than a collection:
     * an empty {@code IN ()} is a syntax error in Postgres, and a null string is
     * a cleaner way to say "no category filter" than a special-cased list.
     */
    @Query(value = """
            SELECT ep.*
            FROM   variant_effective_prices ep
            JOIN   product_variants v ON v.id = ep.variant_id AND v.is_active AND v.is_default
            JOIN   products p         ON p.id = v.product_id  AND p.status = 'ACTIVE'
            LEFT   JOIN categories c  ON c.id = p.category_id
            LEFT   JOIN product_ratings pr ON pr.product_id = p.id
            WHERE  (CAST(:term AS text) IS NULL
                    OR p.search_vector @@ plainto_tsquery('simple', CAST(:term AS text)))
              AND  (CAST(:categorySlugs AS text) IS NULL
                    OR c.slug = ANY(string_to_array(CAST(:categorySlugs AS text), ',')))
              AND  (CAST(:minPrice AS numeric) IS NULL
                    OR ep.effective_price_amount >= CAST(:minPrice AS numeric))
              AND  (CAST(:maxPrice AS numeric) IS NULL
                    OR ep.effective_price_amount <= CAST(:maxPrice AS numeric))
              AND  (CAST(:minRating AS numeric) IS NULL
                    OR pr.average_rating >= CAST(:minRating AS numeric))
            ORDER  BY
                   CASE WHEN :sort = 'PRICE_ASC'  THEN ep.effective_price_amount END ASC,
                   CASE WHEN :sort = 'PRICE_DESC' THEN ep.effective_price_amount END DESC,
                   CASE WHEN :sort = 'RATING'     THEN pr.average_rating END DESC NULLS LAST,
                   CASE WHEN :sort = 'RATING'     THEN pr.review_count   END DESC NULLS LAST,
                   CASE WHEN :sort = 'NEWEST'     THEN p.created_at END DESC,
                   p.name ASC
            """,
            countQuery = """
            SELECT count(*)
            FROM   variant_effective_prices ep
            JOIN   product_variants v ON v.id = ep.variant_id AND v.is_active AND v.is_default
            JOIN   products p         ON p.id = v.product_id  AND p.status = 'ACTIVE'
            LEFT   JOIN categories c  ON c.id = p.category_id
            LEFT   JOIN product_ratings pr ON pr.product_id = p.id
            WHERE  (CAST(:term AS text) IS NULL
                    OR p.search_vector @@ plainto_tsquery('simple', CAST(:term AS text)))
              AND  (CAST(:categorySlugs AS text) IS NULL
                    OR c.slug = ANY(string_to_array(CAST(:categorySlugs AS text), ',')))
              AND  (CAST(:minPrice AS numeric) IS NULL
                    OR ep.effective_price_amount >= CAST(:minPrice AS numeric))
              AND  (CAST(:maxPrice AS numeric) IS NULL
                    OR ep.effective_price_amount <= CAST(:maxPrice AS numeric))
              AND  (CAST(:minRating AS numeric) IS NULL
                    OR pr.average_rating >= CAST(:minRating AS numeric))
            """,
            nativeQuery = true)
    Page<VariantPriceView> shop(@Param("term") String term,
                                @Param("categorySlugs") String categorySlugs,
                                @Param("minPrice") BigDecimal minPrice,
                                @Param("maxPrice") BigDecimal maxPrice,
                                @Param("minRating") BigDecimal minRating,
                                @Param("sort") String sort,
                                Pageable pageable);
}
