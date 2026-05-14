package com.zcommerce.backend.Services;

import java.util.UUID;
import java.time.Instant;
import java.time.Duration;
import com.zcommerce.backend.Models.*;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import com.zcommerce.backend.Repositories.SessionRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SessionService {
    private final SessionRepository sessionRepository;

    public SessionService(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    // - Create --

    @Transactional
    public String create(UserModel user){
        SessionModel session = SessionModel.builder()
            .user(user)
            .token(generateUniqueToken())
            .deviceType("Unknown")
            .location("Unknown")
            .lastUsedAt(Instant.now())
            .expiresAt(Instant.now().plus(Duration.ofDays(7)))
            .build();

        sessionRepository.save(session);
        return session.getToken();
    } 

    // - Finders --

    @Transactional(readOnly = true)
    public SessionModel findByToken(String token) {
        return sessionRepository.findbyToken(token).orElseThrow(() -> new EntityNotFoundException("Session not found"));
    }


    // Private helper to generate unique token
    private String generateUniqueToken() {
        String token;
        do {
            token = UUID.randomUUID().toString();
        } while (sessionRepository.findbyToken(token).isPresent());
        
        return token;
    }
}
