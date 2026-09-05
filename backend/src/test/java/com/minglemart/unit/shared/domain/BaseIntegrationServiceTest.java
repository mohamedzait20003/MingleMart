package com.minglemart.unit.shared.domain;

import com.minglemart.shared.domain.BaseIntegrationService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.UUID;

import org.junit.jupiter.api.Test;

import com.minglemart.shared.common.ActorRef;

class BaseIntegrationServiceTest {

    /** Concrete stand-in; the base class is abstract but has no abstract methods. */
    static class Sample extends BaseIntegrationService {
        String key(String op, Object... parts) {
            return idempotencyKey(op, parts);
        }

        ActorRef actor(ActorRef a) {
            return requireActor(a);
        }

        void guard(ActorRef a, String op) {
            rejectUnattendedAgent(a, op);
        }
    }

    private final Sample service = new Sample();

    @Test
    void idempotencyKeyIsStableForTheSameInputs() {
        // This is the whole point: a retried tool call must collide with the
        // UNIQUE constraint rather than create a second order.
        UUID user = UUID.randomUUID();

        assertThat(service.key("place-order", user, 3))
                .isEqualTo(service.key("place-order", user, 3));
    }

    @Test
    void idempotencyKeyChangesWithInputs() {
        UUID user = UUID.randomUUID();

        assertThat(service.key("place-order", user, 3))
                .isNotEqualTo(service.key("place-order", user, 4));
    }

    @Test
    void idempotencyKeyDistinguishesOperations() {
        UUID id = UUID.randomUUID();

        assertThat(service.key("place-order", id)).isNotEqualTo(service.key("cancel-order", id));
    }

    @Test
    void idempotencyKeyFitsTheColumn() {
        // orders/payments/refunds/notifications all declare varchar(128).
        String key = service.key("a-fairly-long-operation-name", UUID.randomUUID(), UUID.randomUUID());

        assertThat(key).hasSizeLessThanOrEqualTo(128);
    }

    @Test
    void requireActorRejectsNull() {
        assertThatThrownBy(() -> service.actor(null))
                .isInstanceOf(NullPointerException.class)
                .hasMessageContaining("ActorRef.SYSTEM");
    }

    @Test
    void agentMayNotPerformAGuardedOperationUnattended() {
        // Mirrors ck_agent_actions_high_risk_gated in the schema.
        assertThatThrownBy(() -> service.guard(ActorRef.agent(UUID.randomUUID()), "capture payment"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("capture payment");
    }

    @Test
    void humansPassTheGuard() {
        service.guard(ActorRef.user(UUID.randomUUID()), "capture payment");
        service.guard(ActorRef.SYSTEM, "capture payment");
    }
}
