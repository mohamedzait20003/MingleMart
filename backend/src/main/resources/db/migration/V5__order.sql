-- ============================================================================
-- Module: order
-- Placed orders, their lines, address snapshots and status history.
--
-- Two things here exist specifically to survive an agent retrying itself:
--   * orders.idempotency_key — UNIQUE. A "place the order" tool call that runs
--     twice produces one order, not two. This is the single most important
--     constraint in the whole schema for agentic safety.
--   * order_items / order_addresses snapshot names, prices and addresses at
--     placement time, so later edits to catalogue or profile never rewrite
--     history.
-- ============================================================================

CREATE TABLE orders (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    -- human-facing reference shown in chat: "MM-2026-000123"
    order_number varchar(32)   NOT NULL UNIQUE,
    user_id      uuid          NOT NULL REFERENCES users(id) ON DELETE RESTRICT,  -- crosses into: user
    cart_id      uuid          REFERENCES carts(id) ON DELETE SET NULL,           -- crosses into: cart

    status       varchar(24)   NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'AWAITING_PAYMENT', 'PAID', 'PROCESSING',
                          'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED',
                          'PARTIALLY_REFUNDED')),

    currency        char(3)       NOT NULL DEFAULT 'USD',
    subtotal_amount numeric(19,4) NOT NULL CHECK (subtotal_amount >= 0),
    discount_amount numeric(19,4) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    shipping_amount numeric(19,4) NOT NULL DEFAULT 0 CHECK (shipping_amount >= 0),
    tax_amount      numeric(19,4) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    total_amount    numeric(19,4) NOT NULL CHECK (total_amount >= 0),
    -- how much of total_amount has been given back so far
    refunded_amount numeric(19,4) NOT NULL DEFAULT 0 CHECK (refunded_amount >= 0),

    -- who placed it: a human at the keyboard, or the chat agent on their behalf
    actor_type   varchar(16)   NOT NULL DEFAULT 'USER'
        CHECK (actor_type IN ('USER', 'AGENT', 'ADMIN', 'SYSTEM')),

    -- Deduplicates retried "place order" tool calls. Null for orders created
    -- through the normal UI, where the browser already guards against this.
    idempotency_key varchar(128) UNIQUE,

    customer_note text,
    placed_at    timestamptz,
    cancelled_at timestamptz,
    created_at   timestamptz   NOT NULL DEFAULT now(),
    updated_at   timestamptz   NOT NULL DEFAULT now(),

    CONSTRAINT ck_orders_refund_within_total CHECK (refunded_amount <= total_amount)
);

CREATE INDEX ix_orders_user   ON orders (user_id, created_at DESC);
CREATE INDEX ix_orders_status ON orders (status);

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------- order items ----
CREATE TABLE order_items (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id   uuid          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    -- RESTRICT, not CASCADE: a delisted product must not erase order history
    variant_id uuid          REFERENCES product_variants(id) ON DELETE RESTRICT,

    -- snapshots, so the line reads correctly forever
    sku          varchar(64) NOT NULL,
    product_name text        NOT NULL,
    variant_name text        NOT NULL,

    quantity          integer       NOT NULL CHECK (quantity > 0),
    unit_price_amount numeric(19,4) NOT NULL CHECK (unit_price_amount >= 0),
    total_amount      numeric(19,4) NOT NULL CHECK (total_amount >= 0),
    -- units already sent back; drives partial refunds
    refunded_quantity integer       NOT NULL DEFAULT 0 CHECK (refunded_quantity >= 0),
    currency          char(3)       NOT NULL DEFAULT 'USD',

    CONSTRAINT ck_order_items_refund_qty CHECK (refunded_quantity <= quantity)
);

CREATE INDEX ix_order_items_order ON order_items (order_id);

-- ------------------------------------------------------ address snapshot ----
CREATE TABLE order_addresses (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id       uuid        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    address_type   varchar(16) NOT NULL CHECK (address_type IN ('SHIPPING', 'BILLING')),
    recipient_name text        NOT NULL,
    phone          text,
    line1          text        NOT NULL,
    line2          text,
    city           text        NOT NULL,
    region         text,
    postal_code    varchar(32),
    country_code   char(2)     NOT NULL,

    UNIQUE (order_id, address_type)
);

-- ---------------------------------------------------------- status trail ----
CREATE TABLE order_status_history (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id    uuid        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    from_status varchar(24),
    to_status   varchar(24) NOT NULL,
    reason      text,
    actor_type  varchar(16) NOT NULL DEFAULT 'SYSTEM'
        CHECK (actor_type IN ('USER', 'AGENT', 'ADMIN', 'SYSTEM')),
    actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ix_order_status_history_order ON order_status_history (order_id, created_at);
