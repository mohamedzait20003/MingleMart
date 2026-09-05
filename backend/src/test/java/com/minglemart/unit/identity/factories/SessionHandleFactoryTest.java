package com.minglemart.unit.identity.factories;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.minglemart.modules.identity.factories.SessionHandleFactory;

class SessionHandleFactoryTest {

    private final SessionHandleFactory factory = new SessionHandleFactory();

    @Test
    void derivesThePublicIdFromSaltAndHandle() {
        var minted = factory.mint();

        assertThat(factory.derive(minted.handle(), minted.salt()))
                .isEqualTo(minted.publicId());
    }

    @Test
    void neverExposesTheRawHandle() {
        var minted = factory.mint();

        assertThat(minted.publicId())
                .isNotEqualTo(minted.handle())
                .isNotEqualTo(minted.salt())
                .doesNotContain(minted.handle());
    }

    @Test
    void publicIdIsShortEnoughForAUrlSegment() {
        assertThat(factory.mint().publicId()).hasSize(32).matches("[0-9a-f]{32}");
    }

    @Test
    void theSaltMakesIdenticalHandlesDeriveDifferently() {
        // Why the salt exists: without it a repeated handle would produce a
        // repeated public id across sessions.
        String handle = factory.mint().handle();

        assertThat(factory.derive(handle, "salt-one"))
                .isNotEqualTo(factory.derive(handle, "salt-two"));
    }

    @Test
    void matchesAcceptsTheDerivedIdAndRejectsAnythingElse() {
        var minted = factory.mint();

        assertThat(factory.matches(minted.handle(), minted.salt(), minted.publicId())).isTrue();
        assertThat(factory.matches(minted.handle(), minted.salt(), "deadbeef")).isFalse();
        assertThat(factory.matches(minted.handle(), "wrong-salt", minted.publicId())).isFalse();
    }

    @Test
    void matchesRejectsNullsRatherThanThrowing() {
        var minted = factory.mint();

        assertThat(factory.matches(null, minted.salt(), minted.publicId())).isFalse();
        assertThat(factory.matches(minted.handle(), minted.salt(), null)).isFalse();
    }

    @Test
    void everySessionGetsItsOwnHandleAndSalt() {
        var a = factory.mint();
        var b = factory.mint();

        assertThat(a.handle()).isNotEqualTo(b.handle());
        assertThat(a.salt()).isNotEqualTo(b.salt());
        assertThat(a.publicId()).isNotEqualTo(b.publicId());
    }
}
