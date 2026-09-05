package com.minglemart.shared.common;

import java.util.UUID;

/**
 * The actor behind an operation. Passed across every contract boundary so the
 * module performing the write can record attribution without knowing whether it
 * was called from a controller or from the chat agent.
 */
public record ActorRef(ActorType type, UUID userId) {

    public static final ActorRef SYSTEM = new ActorRef(ActorType.SYSTEM, null);

    public static ActorRef user(UUID userId) {
        return new ActorRef(ActorType.USER, userId);
    }

    /** An action the assistant performs on behalf of {@code userId}. */
    public static ActorRef agent(UUID userId) {
        return new ActorRef(ActorType.AGENT, userId);
    }

    public boolean isAgent() {
        return type == ActorType.AGENT;
    }
}
