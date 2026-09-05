package com.minglemart.modules.identity.services;

import java.util.UUID;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minglemart.shared.domain.BaseDataService;
import com.minglemart.modules.identity.models.RoleModel;
import com.minglemart.modules.identity.models.UserModel;
import com.minglemart.modules.identity.repositories.UserRepository;



@Service
public class UserService extends BaseDataService<UserModel, UserRepository> {

    public UserService(UserRepository repository) {
        super(repository);
    }

    @Override
    protected String entityName() {
        return "User";
    }

    public Optional<UserModel> findByEmail(String email) {
        return repository.findByEmailIgnoreCase(email);
    }

    public Optional<UserModel> findByUsername(String username) {
        return repository.findByUsernameIgnoreCase(username);
    }

    /** Excludes soft-deleted accounts. Use this for anything user-facing. */
    public Optional<UserModel> findActive(UUID id) {
        return repository.findByIdAndDeletedAtIsNull(id);
    }

    public boolean emailTaken(String email) {
        return repository.existsByEmailIgnoreCase(email);
    }

    public boolean usernameTaken(String username) {
        return repository.existsByUsernameIgnoreCase(username);
    }

    @Transactional
    public UserModel assignRole(UUID userId, RoleModel role) {
        return update(userId, user -> user.setRole(role));
    }

    @Transactional
    public UserModel markVerified(UUID userId) {
        return update(userId, user -> user.setVerified(true));
    }

    /**
     * Retires the account without removing the row, so the RESTRICT foreign keys
     * from orders and payments stay intact and history survives.
     */
    @Transactional
    public UserModel softDelete(UUID userId) {
        return update(userId, user -> {
            user.markDeleted();
            user.setActive(false);
        });
    }
}