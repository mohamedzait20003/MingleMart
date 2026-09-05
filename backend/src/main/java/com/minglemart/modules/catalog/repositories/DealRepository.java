package com.minglemart.modules.catalog.repositories;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.minglemart.modules.catalog.models.DealModel;
import com.minglemart.shared.domain.BaseRepository;
import com.minglemart.shared.enums.DealStatus;

public interface DealRepository extends BaseRepository<DealModel> {

    Optional<DealModel> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<DealModel> findByStatusOrderByPriorityDesc(DealStatus status);

    /**
     * Campaigns running at {@code now}: switched on, and inside their window.
     *
     * <p>Being ACTIVE is not the same as being live — a deal scheduled for next
     * Friday is ACTIVE today and must not appear. Nothing flips a status at
     * midnight, so the clock is always part of the question.
     */
    @Query("""
            SELECT d FROM DealModel d
            WHERE  d.status = com.minglemart.shared.enums.DealStatus.ACTIVE
              AND  (d.startsAt IS NULL OR d.startsAt <= :now)
              AND  (d.endsAt   IS NULL OR d.endsAt   >  :now)
            ORDER  BY d.priority DESC, d.endsAt ASC NULLS LAST
            """)
    List<DealModel> findLive(@Param("now") Instant now);

    /** The hero: the highest-priority live deal flagged as featured. */
    @Query("""
            SELECT d FROM DealModel d
            WHERE  d.status = com.minglemart.shared.enums.DealStatus.ACTIVE
              AND  d.featured = true
              AND  (d.startsAt IS NULL OR d.startsAt <= :now)
              AND  (d.endsAt   IS NULL OR d.endsAt   >  :now)
            ORDER  BY d.priority DESC, d.endsAt ASC NULLS LAST
            """)
    List<DealModel> findLiveFeatured(@Param("now") Instant now, Pageable pageable);

    /** Live campaigns whose window closes within the horizon — "ending soon". */
    @Query("""
            SELECT d FROM DealModel d
            WHERE  d.status = com.minglemart.shared.enums.DealStatus.ACTIVE
              AND  d.endsAt IS NOT NULL
              AND  d.endsAt >  :now
              AND  d.endsAt <= :horizon
            ORDER  BY d.endsAt ASC
            """)
    List<DealModel> findEndingBefore(@Param("now") Instant now, @Param("horizon") Instant horizon);
}
