-- ============================================================================
-- Module: payment
-- Stored methods, payment attempts, refunds, provider webhook log.
--
-- Nothing here ever stores a raw card number. `provider_token` is the vault
-- reference handed back by Stripe/Adyen/etc; brand + last4 exist only so the
-- chat agent can say "your Visa ending 4242" without touching PAN data.
-- ============================================================================

CREATE TABLE payment_methods (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- crosses into: user
    provider       varchar(32) NOT NULL,
    -- vault reference at the provider; never card data
    provider_token text        NOT NULL,
    method_type    varchar(24) NOT NULL
        CHECK (method_type IN ('CARD', 'WALLET', 'BANK_TRANSFER', 'CASH_ON_DELIVERY')),
    brand          varchar(32),
    last4          char(4),
    exp_month      smallint CHECK (exp_month BETWEEN 1 AND 12),
    exp_year       smallint CHECK (exp_year >= 2020),
    is_default     boolean     NOT NULL DEFAULT false,
    created_at     timestamptz NOT NULL DEFAULT now(),
    deleted_at     timestamptz,

    UNIQUE (provider, provider_token)
);

CREATE INDEX ix_payment_methods_user ON payment_methods (user_id) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX ux_payment_methods_default
    ON payment_methods (user_id) WHERE is_default AND deleted_at IS NULL;

-- ------------------------------------------------------------- payments -----
CREATE TABLE payments (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id   uuid          NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,  -- crosses into: order
    payment_method_id uuid   REFERENCES payment_methods(id) ON DELETE SET NULL,

    provider            varchar(32) NOT NULL,
    provider_payment_id text,
    -- present for card flows that need a second user step (3-D Secure)
    provider_client_secret text,

    amount   numeric(19,4) NOT NULL CHECK (amount > 0),
    currency char(3)       NOT NULL DEFAULT 'USD',

    status varchar(24) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'REQUIRES_ACTION', 'AUTHORIZED', 'CAPTURED',
                          'FAILED', 'CANCELLED', 'EXPIRED')),

    -- how much of this capture has been refunded
    refunded_amount numeric(19,4) NOT NULL DEFAULT 0 CHECK (refunded_amount >= 0),

    actor_type varchar(16) NOT NULL DEFAULT 'USER'
        CHECK (actor_type IN ('USER', 'AGENT', 'ADMIN', 'SYSTEM')),

    -- Stops a retried "pay" tool call from charging the customer twice.
    idempotency_key varchar(128) UNIQUE,

    failure_code    varchar(64),
    failure_message text,
    authorized_at timestamptz,
    captured_at   timestamptz,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT ck_payments_refund_within_amount CHECK (refunded_amount <= amount)
);

CREATE INDEX ix_payments_order    ON payments (order_id);
CREATE INDEX ix_payments_status   ON payments (status);
CREATE UNIQUE INDEX ux_payments_provider_ref
    ON payments (provider, provider_payment_id) WHERE provider_payment_id IS NOT NULL;

CREATE TRIGGER trg_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- -------------------------------------------------------------- refunds -----
CREATE TABLE refunds (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id uuid          NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
    order_id   uuid          NOT NULL REFERENCES orders(id)   ON DELETE RESTRICT,

    amount   numeric(19,4) NOT NULL CHECK (amount > 0),
    currency char(3)       NOT NULL DEFAULT 'USD',

    reason varchar(32) NOT NULL
        CHECK (reason IN ('REQUESTED_BY_CUSTOMER', 'DAMAGED', 'WRONG_ITEM',
                          'NOT_DELIVERED', 'DUPLICATE', 'FRAUDULENT', 'OTHER')),
    reason_note text,

    -- REQUESTED is where an agent-initiated refund lands; a human moves it on.
    status varchar(24) NOT NULL DEFAULT 'REQUESTED'
        CHECK (status IN ('REQUESTED', 'APPROVED', 'REJECTED', 'PROCESSING',
                          'SUCCEEDED', 'FAILED')),

    provider_refund_id text,

    requested_by_actor varchar(16) NOT NULL DEFAULT 'USER'
        CHECK (requested_by_actor IN ('USER', 'AGENT', 'ADMIN', 'SYSTEM')),
    requested_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
    -- deliberately a user, never an agent: money leaving needs a human owner
    approved_by_user_id  uuid REFERENCES users(id) ON DELETE SET NULL,
    approved_at timestamptz,

    idempotency_key varchar(128) UNIQUE,

    failure_message text,
    processed_at timestamptz,
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),

    -- An approved refund must name who approved it.
    CONSTRAINT ck_refunds_approval_recorded
        CHECK (status <> 'APPROVED' OR approved_by_user_id IS NOT NULL)
);

CREATE INDEX ix_refunds_payment ON refunds (payment_id);
CREATE INDEX ix_refunds_order   ON refunds (order_id);
CREATE INDEX ix_refunds_pending ON refunds (status) WHERE status IN ('REQUESTED', 'PROCESSING');

CREATE TRIGGER trg_refunds_updated_at
    BEFORE UPDATE ON refunds
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------- provider webhook log -----
-- Append-only. Providers redeliver webhooks; (provider, provider_event_id)
-- being UNIQUE makes replay a no-op instead of a double refund.
CREATE TABLE payment_events (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id uuid REFERENCES payments(id) ON DELETE CASCADE,
    refund_id  uuid REFERENCES refunds(id)  ON DELETE CASCADE,

    provider          varchar(32) NOT NULL,
    provider_event_id text        NOT NULL,
    event_type        varchar(64) NOT NULL,
    payload           jsonb       NOT NULL,
    processed_at      timestamptz,
    created_at        timestamptz NOT NULL DEFAULT now(),

    UNIQUE (provider, provider_event_id)
);

CREATE INDEX ix_payment_events_payment ON payment_events (payment_id);
CREATE INDEX ix_payment_events_unprocessed ON payment_events (created_at) WHERE processed_at IS NULL;
