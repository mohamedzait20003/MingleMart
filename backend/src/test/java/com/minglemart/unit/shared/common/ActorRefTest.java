package com.minglemart.unit.shared.common;

import com.minglemart.shared.common.ActorRef;
import com.minglemart.shared.common.ActorType;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.UUID;

import org.junit.jupiter.api.Test;

class ActorRefTest {

    @Test
    void distinguishesAgentFromHuman() {
        UUID user = UUID.randomUUID();

        assertThat(ActorRef.agent(user).isAgent()).isTrue();
        assertThat(ActorRef.user(user).isAgent()).isFalse();
        assertThat(ActorRef.SYSTEM.isAgent()).isFalse();
    }

    @Test
    void agentActsOnBehalfOfAUser() {
        // An agent action is always attributable to the person it acted for.
        UUID user = UUID.randomUUID();

        assertThat(ActorRef.agent(user).userId()).isEqualTo(user);
        assertThat(ActorRef.agent(user).type()).isEqualTo(ActorType.AGENT);
    }

    @Test
    void systemHasNoUser() {
        assertThat(ActorRef.SYSTEM.userId()).isNull();
        assertThat(ActorRef.SYSTEM.type()).isEqualTo(ActorType.SYSTEM);
    }
}
