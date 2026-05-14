package com.zcommerce.backend.Repositories;

import java.util.List;
import java.time.Instant;
import java.util.Optional;
import com.zcommerce.backend.Models.UserModel;
import com.zcommerce.backend.Models.SessionModel;

import org.springframework.stereotype.Repository;


@Repository
public interface SessionRepository extends BaseRepository<SessionModel> {
    void deleteAllByUser(UserModel user);

    Optional<SessionModel> findbyToken(String token);

    List<SessionModel> findAllByUser(UserModel user);
    
    void deleteAllByExpiresAtBefore(Instant threshold);
}
