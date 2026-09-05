-- ============================================================================
-- Module: agent
-- Conversations, messages, tool calls, and the approval gate for anything the
-- assistant does that touches money or stock.
--
-- Dependency direction matters here. `agent` knows about orders and payments;
-- they know nothing about `agent`. That is why the link between an action and
-- the row it produced lives HERE as (target_type, target_id) rather than as an
-- agent_action_id column bolted onto orders. Business modules stay ignorant of
-- the assistant, which is what lets you delete this whole module without
-- touching checkout.
--
-- The safety model, in short:
--   1. Every tool call is recorded before it runs, keyed by idempotency_key.
--   2. Anything risky becomes an agent_action in AWAITING_APPROVAL — the model
--      cannot execute it, it can only propose it.
--   3. A human confirms in chat; only then does status move to APPROVED and the
--      action execute against the real order/payment module.
-- ============================================================================

CREATE TABLE conversations (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    uuid        REFERENCES users(id) ON DELETE CASCADE,   -- crosses into: user
    -- carries guest chats before sign-in
    session_id uuid        REFERENCES sessions(id) ON DELETE SET NULL,
    title      text,
    status     varchar(16) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'ARCHIVED', 'CLOSED')),
    -- pinned model/prompt version, so a replayed conversation is reproducible
    model            varchar(64),
    system_prompt_version varchar(32),
    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now(),
    last_message_at  timestamptz
);

CREATE INDEX ix_conversations_user ON conversations (user_id, last_message_at DESC);

CREATE TRIGGER trg_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------- messages -----
CREATE TABLE messages (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    -- monotonic per conversation; the replay order, independent of clock skew
    sequence        integer     NOT NULL,
    role            varchar(16) NOT NULL
        CHECK (role IN ('SYSTEM', 'USER', 'ASSISTANT', 'TOOL')),
    content         text,
    -- structured payload for TOOL messages and multi-part assistant turns
    content_json    jsonb,
    input_tokens    integer CHECK (input_tokens  >= 0),
    output_tokens   integer CHECK (output_tokens >= 0),
    created_at      timestamptz NOT NULL DEFAULT now(),

    UNIQUE (conversation_id, sequence)
);

CREATE INDEX ix_messages_conversation ON messages (conversation_id, sequence);

-- ----------------------------------------------------------- tool calls -----
CREATE TABLE agent_tool_calls (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    -- the assistant turn that requested this call
    message_id      uuid        REFERENCES messages(id) ON DELETE SET NULL,
    -- provider-side id, e.g. Anthropic's tool_use id
    provider_call_id text,

    tool_name  varchar(64) NOT NULL,
    arguments  jsonb       NOT NULL DEFAULT '{}'::jsonb,
    result     jsonb,

    status varchar(16) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED', 'REJECTED', 'TIMED_OUT')),
    error_message text,

    -- Same key replayed = same call. Guards against the model re-emitting a
    -- tool_use block after a stream retry.
    idempotency_key varchar(128) UNIQUE,

    started_at  timestamptz,
    finished_at timestamptz,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ix_tool_calls_conversation ON agent_tool_calls (conversation_id, created_at);
CREATE INDEX ix_tool_calls_tool         ON agent_tool_calls (tool_name, status);

-- -------------------------------------------------------------- actions -----
-- One row per *consequential* thing the assistant wants to do. Read-only tools
-- (search_products, get_order_status) never land here — only state changes do.
CREATE TABLE agent_actions (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    tool_call_id    uuid REFERENCES agent_tool_calls(id) ON DELETE SET NULL,
    user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    action_type varchar(32) NOT NULL
        CHECK (action_type IN ('ADD_TO_CART', 'UPDATE_CART_ITEM', 'REMOVE_FROM_CART',
                               'CLEAR_CART', 'PLACE_ORDER', 'CANCEL_ORDER',
                               'CAPTURE_PAYMENT', 'REQUEST_REFUND',
                               'UPDATE_ADDRESS')),

    -- LOW auto-executes; MEDIUM and HIGH require an explicit human yes.
    risk_level varchar(8) NOT NULL DEFAULT 'LOW'
        CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    requires_approval boolean NOT NULL DEFAULT false,

    status varchar(24) NOT NULL DEFAULT 'PROPOSED'
        CHECK (status IN ('PROPOSED', 'AWAITING_APPROVAL', 'APPROVED', 'REJECTED',
                          'EXECUTING', 'EXECUTED', 'FAILED', 'EXPIRED')),

    -- what the assistant intends to do, as validated arguments
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    -- what the shopper is shown before confirming ("Place order for $84.30?")
    summary text,

    -- The link to the business row this produced. Deliberately NOT a foreign
    -- key: `agent` must not pin the schema of `order` or `payment`.
    target_type varchar(24)
        CHECK (target_type IN ('CART', 'CART_ITEM', 'ORDER', 'PAYMENT', 'REFUND', 'ADDRESS')),
    target_id   uuid,

    -- Amount at stake, denormalised so approval UI and audits need no joins.
    amount   numeric(19,4) CHECK (amount >= 0),
    currency char(3),

    -- Passed through to the order/payment module so the downstream write is
    -- itself deduplicated even if this action is executed twice.
    idempotency_key varchar(128) UNIQUE,

    approved_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
    approved_at  timestamptz,
    rejected_at  timestamptz,
    -- an unconfirmed proposal goes stale rather than lingering forever
    expires_at   timestamptz,
    executed_at  timestamptz,
    error_message text,
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),

    -- Anything needing approval must record who gave it before it can execute.
    CONSTRAINT ck_agent_actions_approval_recorded
        CHECK (NOT requires_approval
               OR status <> 'EXECUTED'
               OR approved_by_user_id IS NOT NULL),

    -- A high-risk action can never be marked as not needing approval.
    CONSTRAINT ck_agent_actions_high_risk_gated
        CHECK (risk_level <> 'HIGH' OR requires_approval)
);

CREATE INDEX ix_agent_actions_conversation ON agent_actions (conversation_id, created_at);
CREATE INDEX ix_agent_actions_user         ON agent_actions (user_id, created_at DESC);
CREATE INDEX ix_agent_actions_target       ON agent_actions (target_type, target_id);
CREATE INDEX ix_agent_actions_pending
    ON agent_actions (expires_at) WHERE status = 'AWAITING_APPROVAL';

CREATE TRIGGER trg_agent_actions_updated_at
    BEFORE UPDATE ON agent_actions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------- audit trail -----
-- Append-only, never updated or deleted. This is what you read back when a
-- customer asks "why did your bot refund my order?".
CREATE TABLE agent_audit_log (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
    agent_action_id uuid REFERENCES agent_actions(id) ON DELETE SET NULL,
    user_id         uuid REFERENCES users(id) ON DELETE SET NULL,
    event_type      varchar(48) NOT NULL,
    detail          jsonb       NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ix_agent_audit_action ON agent_audit_log (agent_action_id, created_at);
CREATE INDEX ix_agent_audit_user   ON agent_audit_log (user_id, created_at DESC);
