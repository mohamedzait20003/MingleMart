package com.minglemart.shared.domain;

import com.minglemart.shared.common.ApiResponse;

import java.net.URI;
import java.util.UUID;
import org.slf4j.Logger;
import java.util.Optional;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

public abstract class BaseController {

    protected static final int MAX_PAGE_SIZE = 100;

    protected final Logger log = LoggerFactory.getLogger(getClass());

    // --- responses ---

    protected <T> ResponseEntity<ApiResponse<T>> ok(String message, T data) {
        return ResponseEntity.ok(ApiResponse.of(message, data));
    }

    /** 200 with a message and no payload - sign-out, resend, delete. */
    protected ResponseEntity<ApiResponse<Void>> ok(String message) {
        return ResponseEntity.ok(ApiResponse.of(message));
    }

    protected <T> ResponseEntity<ApiResponse<Page<T>>> okPage(String message, Page<T> page) {
        return ResponseEntity.ok(ApiResponse.of(message, page));
    }

    /** 200 when present, 404 in the same envelope when not. */
    protected <T> ResponseEntity<ApiResponse<T>> okOrNotFound(Optional<T> body, String message, String missing) {
        return body.map(found -> ResponseEntity.ok(ApiResponse.of(message, found))).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failed(missing, "NOT_FOUND")));
    }

    /**
     * 201 with a Location header pointing at the new resource, built by
     * appending /{id} to the current request URI.
     */
    protected <T> ResponseEntity<ApiResponse<T>> created(String message, T data, UUID id) {
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(id).toUri();
        return ResponseEntity.created(location).body(ApiResponse.of(message, data));
    }

    /** A rejection the caller can act on - wrong credentials, unverified email. */
    protected <T> ResponseEntity<ApiResponse<T>> failure(
            HttpStatus status, String message, String error) {
        return ResponseEntity.status(status).body(ApiResponse.failed(message, error));
    }

    // --- pagination ---

    protected Pageable pageable(int page, int size, String sort) {
        int safeSize = Math.clamp(size, 1, MAX_PAGE_SIZE);

        if (sort == null || sort.isBlank()) {
            return PageRequest.of(Math.max(page, 0), safeSize);
        }

        String[] parts = sort.split(",", 2);
        Sort.Direction direction = parts.length > 1 && "desc".equalsIgnoreCase(parts[1].trim())
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        return PageRequest.of(Math.max(page, 0), safeSize, Sort.by(direction, parts[0].trim()));
    }

    // --- exception mapping ---

    @ExceptionHandler(EntityNotFoundException.class)
    ResponseEntity<ApiResponse<Void>> handleNotFound(EntityNotFoundException e) {
        return failure(HttpStatus.NOT_FOUND, e.getMessage(), "NOT_FOUND");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<ApiResponse<Void>> handleBadRequest(IllegalArgumentException e) {
        return failure(HttpStatus.BAD_REQUEST, e.getMessage(), "BAD_REQUEST");
    }

    @ExceptionHandler(IllegalStateException.class)
    ResponseEntity<ApiResponse<Void>> handleConflict(IllegalStateException e) {
        return failure(HttpStatus.CONFLICT, e.getMessage(), "CONFLICT");
    }
}
