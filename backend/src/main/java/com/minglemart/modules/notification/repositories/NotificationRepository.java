package com.minglemart.modules.notification.repositories;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

import com.minglemart.modules.notification.models.NotificationModel;
import com.minglemart.shared.domain.BaseRepository;

public interface NotificationRepository extends BaseRepository<NotificationModel> {
        Optional<NotificationModel> findByIdempotencyKey(String idempotencyKey);

        @Lock(LockModeType.PESSIMISTIC_WRITE)
        @Query("""
            select n from NotificationModel n
            where n.status = :status and n.scheduledAt <= :now
            order by n.scheduledAt asc
            """
        )
        List<NotificationModel> claimDue(@Param("status") String status, @Param("now") Instant now, Limit limit);

        @Query("""
            select n from NotificationModel n
            where n.status = 'FAILED' and n.attempts < :maxAttempts
            order by n.scheduledAt asc
            
        """)
        List<NotificationModel> findRetryable(@Param("maxAttempts") int maxAttempts, Limit limit);
}
