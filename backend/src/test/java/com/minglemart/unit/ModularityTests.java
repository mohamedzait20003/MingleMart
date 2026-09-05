package com.minglemart.unit;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.docs.Documenter;
import org.springframework.modulith.core.ApplicationModules;

import com.minglemart.MinglemartApplication;

class ModularityTests {

    static final ApplicationModules modules = ApplicationModules.of(MinglemartApplication.class);

    @Test
    void verifiesModularStructure() {
        modules.forEach(m -> System.out.println(">>> " + m.getDisplayName() + " -> " + m.getBasePackage()));
        modules.verify();
    }

    @Test
    void writesDocumentation() {
        new Documenter(modules).writeDocumentation();
    }
}
