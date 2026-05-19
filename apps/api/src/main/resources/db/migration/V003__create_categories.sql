CREATE TABLE categories (
    id          UUID PRIMARY KEY,
    name        VARCHAR(120)    NOT NULL,
    description TEXT,
    icon        VARCHAR(60),
    active      BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX uq_categories_name ON categories (name);
CREATE INDEX idx_categories_active ON categories (active);
