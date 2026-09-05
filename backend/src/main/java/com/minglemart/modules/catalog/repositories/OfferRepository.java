package com.minglemart.modules.catalog.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.minglemart.modules.catalog.models.OfferModel;
import com.minglemart.shared.domain.BaseRepository;

public interface OfferRepository extends BaseRepository<OfferModel> {

    List<OfferModel> findByDealId(UUID dealId);

    List<OfferModel> findByDealIdAndActiveTrue(UUID dealId);

    /** Standalone markdowns: live prices that belong to no campaign. */
    List<OfferModel> findByDealIsNullAndActiveTrue();

    /**
     * Takes {@code units} out of the offer's allocation, refusing to overdraw it.
     *
     * <p>A single conditional UPDATE rather than read-then-write: two checkouts
     * racing for the last unit of a flash deal would both read
     * {@code redeemedCount = 39} and both write 40. Here the loser updates zero
     * rows and is told so by the return value.
     *
     * @return 1 when the units were claimed, 0 when the allocation is spent
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("""
            UPDATE OfferModel o
            SET    o.redeemedCount = o.redeemedCount + :units
            WHERE  o.id = :offerId
              AND  (o.redemptionLimit IS NULL
                    OR o.redeemedCount + :units <= o.redemptionLimit)
            """)
    int claimAllocation(@Param("offerId") UUID offerId, @Param("units") int units);

    /**
     * Puts units back when an order is cancelled. Floors at zero so a double
     * release cannot drive the count negative and re-open a spent allocation.
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("""
            UPDATE OfferModel o
            SET    o.redeemedCount = CASE
                       WHEN o.redeemedCount - :units < 0 THEN 0
                       ELSE o.redeemedCount - :units END
            WHERE  o.id = :offerId
            """)
    int releaseAllocation(@Param("offerId") UUID offerId, @Param("units") int units);
}
