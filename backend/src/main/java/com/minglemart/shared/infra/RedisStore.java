package com.minglemart.shared.infra;

import java.util.Set;
import org.slf4j.Logger;
import java.util.HashSet;
import java.time.Duration;
import java.util.List;
import java.util.Optional;
import org.slf4j.LoggerFactory;
import tools.jackson.databind.JavaType;
import tools.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.StringRedisTemplate;

@Component
public class RedisStore {
    private static final Logger log = LoggerFactory.getLogger(RedisStore.class);

    private static final int SCAN_BATCH = 500;
    private final StringRedisTemplate redis;
    private final ObjectMapper json;

    public RedisStore(StringRedisTemplate redis, ObjectMapper json) {
        this.redis = redis;
        this.json = json;
    }

    public <T> Optional<T> get(String key, Class<T> type) {
        try {
            String raw = redis.opsForValue().get(key);
            return raw == null ? Optional.empty() : Optional.of(json.readValue(raw, type));
        } catch (RuntimeException e) {
            log.warn("redis get failed [{}] - serving uncached: {}", key, e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * The cached list, or empty on a miss. A separate method because a
     * {@code Class<List>} erases its element type — Jackson would hand back a
     * list of LinkedHashMap and the cast would only fail at the call site.
     */
    public <T> Optional<List<T>> getList(String key, Class<T> elementType) {
        try {
            String raw = redis.opsForValue().get(key);
            if (raw == null) {
                return Optional.empty();
            }

            JavaType type = json.getTypeFactory().constructCollectionType(List.class, elementType);
            return Optional.of(json.readValue(raw, type));
        } catch (RuntimeException e) {
            log.warn("redis getList failed [{}] - serving uncached: {}", key, e.getMessage());
            return Optional.empty();
        }
    }

    /** Stores a value for {@code ttl}. A failure here costs a cache hit, nothing more. */
    public void set(String key, Object value, Duration ttl) {
        try {
            redis.opsForValue().set(key, json.writeValueAsString(value), ttl);
        } catch (RuntimeException e) {
            log.warn("redis set failed [{}]: {}", key, e.getMessage());
        }
    }

    public void evict(String key) {
        try {
            redis.delete(key);
        } catch (RuntimeException e) {
            log.error("redis evict failed [{}] - entry may be stale: {}", key, e.getMessage());
        }
    }

    /**
     * Removes every key under a prefix — how a write invalidates a family of
     * cached reads it cannot enumerate.
     *
     * <p>SCAN rather than KEYS: KEYS walks the whole keyspace in one blocking
     * call, which on a shared Redis stalls every other client.
     */
    public long evictByPrefix(String prefix) {
        try {
            ScanOptions options = ScanOptions.scanOptions().match(prefix + "*").count(SCAN_BATCH).build();
            long removed = 0;
            Set<String> batch = new HashSet<>();

            try (Cursor<String> cursor = redis.scan(options)) {
                while (cursor.hasNext()) {
                    batch.add(cursor.next());
                    if (batch.size() >= SCAN_BATCH) {
                        removed += delete(batch);
                        batch.clear();
                    }
                }
            }

            removed += delete(batch);
            log.debug("evicted {} keys under [{}*]", removed, prefix);
            return removed;
        } catch (RuntimeException e) {
            log.error("redis evict-by-prefix failed [{}*] - entries may be stale: {}", prefix, e.getMessage());
            return 0;
        }
    }

    public boolean has(String key) {
        try {
            return Boolean.TRUE.equals(redis.hasKey(key));
        } catch (RuntimeException e) {
            log.warn("redis exists failed [{}]: {}", key, e.getMessage());
            return false;
        }
    }

    private long delete(Set<String> keys) {
        if (keys.isEmpty()) {
            return 0;
        }
        Long removed = redis.delete(keys);
        return removed == null ? 0 : removed;
    }
}
