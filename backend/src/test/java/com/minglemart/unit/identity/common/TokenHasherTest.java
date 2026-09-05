package com.minglemart.unit.identity.common;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

import com.minglemart.modules.identity.common.TokenHasher;

class TokenHasherTest {

    @Test
    void isDeterministic() {
        assertThat(TokenHasher.hash("abc")).isEqualTo(TokenHasher.hash("abc"));
    }

    @Test
    void producesSixtyFourHexCharacters() {
        assertThat(TokenHasher.hash("abc")).hasSize(64).matches("[0-9a-f]{64}");
    }

    @Test
    void differentInputsHashDifferently() {
        assertThat(TokenHasher.hash("abc")).isNotEqualTo(TokenHasher.hash("abd"));
    }

    @Test
    void neverReturnsTheInput() {
        // Guards against a future "optimisation" that skips hashing.
        String token = "a-refresh-token-value";
        assertThat(TokenHasher.hash(token)).isNotEqualTo(token);
    }

    @Test
    void matchesComparesTokenAgainstHash() {
        String hash = TokenHasher.hash("secret");

        assertThat(TokenHasher.matches(hash, "secret")).isTrue();
        assertThat(TokenHasher.matches(hash, "wrong")).isFalse();
    }

    @Test
    void matchesRejectsNullsRatherThanThrowing() {
        assertThat(TokenHasher.matches(null, "secret")).isFalse();
        assertThat(TokenHasher.matches(TokenHasher.hash("secret"), null)).isFalse();
    }
}
