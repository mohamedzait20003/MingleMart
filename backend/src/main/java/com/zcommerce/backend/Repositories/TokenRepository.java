package com.zcommerce.backend.Repositories;

import java.util.List;
import java.time.Instant;
import java.util.Optional;
import com.zcommerce.backend.Models.UserModel;
import com.zcommerce.backend.Models.TokenModel;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenRepository extends BaseRepository<TokenModel> {

    Optional<TokenModel> findByValue(String value);

    Optional<TokenModel> findByValueAndType(String value, TokenModel.TokenType type);

    List<TokenModel> findAllByUser(UserModel user);

    List<TokenModel> findAllByUserAndType(UserModel user, TokenModel.TokenType type);

    void deleteAllByUser(UserModel user);

    void deleteAllByUserAndType(UserModel user, TokenModel.TokenType type);

    void deleteAllByExpiresAtBefore(Instant threshold);
}
