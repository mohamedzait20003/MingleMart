package com.minglemart.shared.domain;

import org.slf4j.Logger;
import java.util.Objects;
import org.slf4j.LoggerFactory;


public abstract class BaseFactory {

    protected final Logger log = LoggerFactory.getLogger(getClass());

    protected <T> T require(T value, String name) {
        return Objects.requireNonNull(value, () -> name + " is required to build this");
    }
}
