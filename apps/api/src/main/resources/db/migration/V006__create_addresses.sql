CREATE TABLE addresses (
    id              UUID PRIMARY KEY,
    user_id         UUID            NOT NULL,
    label           VARCHAR(60)     NOT NULL,
    recipient       VARCHAR(120)    NOT NULL,
    street          VARCHAR(200)    NOT NULL,
    number          VARCHAR(20)     NOT NULL,
    complement      VARCHAR(120),
    neighborhood    VARCHAR(120)    NOT NULL,
    city            VARCHAR(120)    NOT NULL,
    state           VARCHAR(2)      NOT NULL,
    postal_code     VARCHAR(20)     NOT NULL,
    is_default      BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_addresses_user ON addresses (user_id);
CREATE UNIQUE INDEX uq_addresses_user_default ON addresses (user_id) WHERE is_default = TRUE;
