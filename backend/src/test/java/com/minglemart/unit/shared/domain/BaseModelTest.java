package com.minglemart.unit.shared.domain;

import com.minglemart.shared.domain.BaseModel;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashSet;
import java.util.UUID;

import org.junit.jupiter.api.Test;

class BaseModelTest {

    static class Thing extends BaseModel {
    }

    static class OtherThing extends BaseModel {
    }

    @Test
    void sameIdMeansSameEntity() {
        UUID id = UUID.randomUUID();
        Thing a = new Thing();
        Thing b = new Thing();
        a.setId(id);
        b.setId(id);

        assertThat(a).isEqualTo(b);
    }

    @Test
    void transientInstancesAreOnlyEqualToThemselves() {
        // Both ids null. Treating them as equal would collapse two unsaved rows
        // into one inside a Set.
        Thing a = new Thing();
        Thing b = new Thing();

        assertThat(a).isEqualTo(a).isNotEqualTo(b);
    }

    @Test
    void hashCodeSurvivesBeingPersisted() {
        // The id is assigned on save. If hashCode used it, an entity already in
        // a Set would move bucket and contains() would start returning false.
        Thing thing = new Thing();
        HashSet<Thing> set = new HashSet<>();
        set.add(thing);

        thing.setId(UUID.randomUUID());

        assertThat(set).contains(thing);
    }

    @Test
    void differentEntityTypesWithTheSameIdAreNotEqual() {
        UUID id = UUID.randomUUID();
        Thing thing = new Thing();
        OtherThing other = new OtherThing();
        thing.setId(id);
        other.setId(id);

        // Different tables can legitimately hold the same uuid.
        assertThat(thing.hashCode()).isNotEqualTo(other.hashCode());
    }
}
