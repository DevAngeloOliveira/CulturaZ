CREATE TABLE seller_profiles (
    id              UUID PRIMARY KEY,
    user_id         UUID            NOT NULL,
    store_name      VARCHAR(160)    NOT NULL,
    description     TEXT,
    type            VARCHAR(20)     NOT NULL,
    rating          NUMERIC(3,2)    NOT NULL DEFAULT 0,
    status          VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT chk_seller_type CHECK (type IN ('INDIVIDUAL','BOOKSTORE','SEBO')),
    CONSTRAINT chk_seller_status CHECK (status IN ('ACTIVE','SUSPENDED','PENDING_REVIEW')),
    CONSTRAINT uq_seller_profiles_user UNIQUE (user_id),
    CONSTRAINT fk_seller_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_seller_profiles_status ON seller_profiles (status);
