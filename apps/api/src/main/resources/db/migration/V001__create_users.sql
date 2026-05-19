CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id              UUID PRIMARY KEY,
    name            VARCHAR(120)    NOT NULL,
    email           VARCHAR(160)    NOT NULL,
    password_hash   VARCHAR(120)    NOT NULL,
    phone           VARCHAR(20),
    status          VARCHAR(30)     NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT chk_users_status CHECK (status IN ('ACTIVE','BLOCKED','PENDING_VERIFICATION','DELETED'))
);

CREATE UNIQUE INDEX uq_users_email ON users (email);
CREATE INDEX idx_users_status ON users (status);

CREATE TABLE user_roles (
    user_id     UUID         NOT NULL,
    role        VARCHAR(20)  NOT NULL,
    CONSTRAINT pk_user_roles PRIMARY KEY (user_id, role),
    CONSTRAINT chk_user_roles_role CHECK (role IN ('CUSTOMER','SELLER','ADMIN','SUPPORT')),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_roles_user ON user_roles (user_id);
