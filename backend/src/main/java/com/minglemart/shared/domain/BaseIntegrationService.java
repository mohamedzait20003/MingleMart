package com.minglemart.shared.domain;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.minglemart.shared.common.ActorRef;

public abstract class BaseIntegrationService {

    protected final Logger log = LoggerFactory.getLogger(getClass());

    protected ActorRef requireActor(ActorRef actor) {
        return Objects.requireNonNull(actor, "actor is required — use ActorRef.SYSTEM for background work");
    }

    protected void rejectUnattendedAgent(ActorRef actor, String operation) {
        if (requireActor(actor).isAgent()) {
            throw new IllegalStateException("%s requires human approval; the agent may only propose it".formatted(operation));
        }
    }

    protected String idempotencyKey(String operation, Object... parts) {
        StringBuilder raw = new StringBuilder(operation);
        for (Object part : parts) {
            raw.append('|').append(part);
        }

        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(raw.toString().getBytes(StandardCharsets.UTF_8));
            return operation + ':' + HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }
}
