-- V1__create_users_table.sql
-- Flyway will run this exactly once, in order.

CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');

CREATE TABLE users (
    id                       UUID         NOT NULL DEFAULT gen_random_uuid(),
    username                 VARCHAR(50)  NOT NULL,
    email                    VARCHAR(255) NOT NULL,
    password                 TEXT         NOT NULL,
    role                     user_role    NOT NULL DEFAULT 'USER',
    enabled                  BOOLEAN      NOT NULL DEFAULT FALSE,
    account_non_expired      BOOLEAN      NOT NULL DEFAULT TRUE,
    account_non_locked       BOOLEAN      NOT NULL DEFAULT TRUE,
    credentials_non_expired  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at               TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at               TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT pk_users             PRIMARY KEY (id),
    CONSTRAINT uk_users_username    UNIQUE      (username),
    CONSTRAINT uk_users_email       UNIQUE      (email)
);
