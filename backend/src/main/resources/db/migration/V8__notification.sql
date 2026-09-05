-- ============================================================================
-- Module: notification
-- Templates, per-user preferences, and an outbound delivery log.
--
-- The notification module owns copy and delivery. Callers reach it through
-- Notifier.send(userId, channel, templateCode, variables) and never pass
-- rendered text, so wording and localisation stay on this side of the boundary.
--
-- `notifications` doubles as an outbox: a row is written in the same
-- transaction as the business change, then the dispatch job picks up PENDING
-- rows, renders the template and sends. An order confirmation is never lost
-- because the mail server was down at commit time.
--
-- Copy lives in resources/templates/{group}/{name}.html, NOT in the database:
-- templates are code, they belong in version control alongside the service that
-- sends them.
-- ============================================================================

-- ---------------------------------------------------------- preferences -----
-- Replaces the boolean columns a user table usually accretes; adding a category
-- here needs no migration of `users`.
CREATE TABLE notification_preferences (
    id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id  uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- crosses into: identity
    channel  varchar(16) NOT NULL
        CHECK (channel IN ('EMAIL', 'SMS', 'PUSH', 'IN_APP')),
    category varchar(32) NOT NULL
        CHECK (category IN ('SECURITY', 'ACCOUNT', 'ORDER', 'SHIPPING',
                            'PAYMENT', 'MARKETING', 'AGENT')),
    enabled  boolean     NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    UNIQUE (user_id, channel, category)
);

CREATE INDEX ix_notification_preferences_user ON notification_preferences (user_id);

CREATE TRIGGER trg_notification_preferences_updated_at
    BEFORE UPDATE ON notification_preferences
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------- delivery log -------
CREATE TABLE notifications (
    id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id  uuid        REFERENCES users(id) ON DELETE SET NULL,          -- crosses into: identity
    channel  varchar(16) NOT NULL
        CHECK (channel IN ('EMAIL', 'SMS', 'PUSH', 'IN_APP')),
    category varchar(32) NOT NULL
        CHECK (category IN ('SECURITY', 'ACCOUNT', 'ORDER', 'SHIPPING',
                            'PAYMENT', 'MARKETING', 'AGENT')),
    -- Directory under resources/templates/, named after the queueing service
    -- with its NotificationService suffix stripped (Auth, Order), and the file
    -- within it.
    template_group varchar(64) NOT NULL,
    template_name  varchar(64) NOT NULL,

    -- resolved address at send time: email, phone or device token
    recipient text NOT NULL,
    subject   text NOT NULL,

    -- The message data the template is filled with. Rendering happens in the
    -- dispatcher, so editing a template changes what an unsent message says.
    body      jsonb NOT NULL DEFAULT '{}'::jsonb,

    status varchar(16) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'SENDING', 'SENT', 'FAILED', 'BOUNCED', 'SUPPRESSED')),

    provider            varchar(32),
    provider_message_id text,

    -- what triggered this, without a foreign key into order/payment/agent
    source_type varchar(24)
        CHECK (source_type IN ('ORDER', 'PAYMENT', 'REFUND', 'SESSION', 'ACCOUNT', 'AGENT')),
    source_id   uuid,

    -- redelivery guard: the same business event must not mail twice
    idempotency_key varchar(128) UNIQUE,

    attempts      integer     NOT NULL DEFAULT 0 CHECK (attempts >= 0),
    error_message text,
    scheduled_at  timestamptz NOT NULL DEFAULT now(),
    sent_at       timestamptz,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ix_notifications_user   ON notifications (user_id, created_at DESC);
CREATE INDEX ix_notifications_source ON notifications (source_type, source_id);

-- The dispatcher's claim query: oldest due, still pending.
CREATE INDEX ix_notifications_outbox
    ON notifications (scheduled_at) WHERE status IN ('PENDING', 'SENDING');

CREATE TRIGGER trg_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
