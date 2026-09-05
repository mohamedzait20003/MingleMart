package com.minglemart.shared.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Consumer;

import jakarta.persistence.EntityNotFoundException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public abstract class BaseDataService<T extends BaseModel, R extends BaseRepository<T>> {

    protected final Logger log = LoggerFactory.getLogger(getClass());

    protected final R repository;

    protected BaseDataService(R repository) {
        this.repository = repository;
    }

    protected String entityName() {
        return "Entity";
    }

    // --- reads ---

    public List<T> findAll() {
        return repository.findAll();
    }

    /** Prefer this over {@link #findAll()} anywhere the row count is unbounded. */
    public Page<T> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Optional<T> find(UUID id) {
        return repository.findById(id);
    }

    public T getOrThrow(UUID id) {
        return repository.findById(id).orElseThrow(() -> notFound(id));
    }

    public boolean exists(UUID id) {
        return repository.existsById(id);
    }

    public long count() {
        return repository.count();
    }

    // --- writes ---

    /**
     * Persists a new aggregate. The id is cleared first so a client-supplied
     * value can never turn a create endpoint into an overwrite of someone
     * else's row.
     */
    @Transactional
    public T create(T entity) {
        entity.setId(null);
        return repository.save(entity);
    }

    /**
     * Loads the aggregate, applies {@code mutation} to the managed instance and
     * flushes.
     *
     * <p>The load-then-mutate shape is deliberate: handing a detached entity to
     * {@code save()} overwrites every column the caller left unset, which is how
     * a partial update silently erases data.
     */
    @Transactional
    public T update(UUID id, Consumer<T> mutation) {
        T managed = getOrThrow(id);
        mutation.accept(managed);
        return repository.save(managed);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw notFound(id);
        }
        repository.deleteById(id);
    }

    // --- helpers ---

    protected EntityNotFoundException notFound(UUID id) {
        return new EntityNotFoundException("%s %s not found".formatted(entityName(), id));
    }
}
