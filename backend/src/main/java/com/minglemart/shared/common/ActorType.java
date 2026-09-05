package com.minglemart.shared.common;

/**
 * Who caused a change. Mirrors the {@code actor_type} CHECK constraint carried
 * by every mutating table, so an agent-driven write is always distinguishable
 * from a human one.
 */
public enum ActorType {
    USER,
    AGENT,
    ADMIN,
    SYSTEM
}
