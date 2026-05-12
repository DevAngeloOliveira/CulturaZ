-- =====================================================================
-- CulturaZ — schema inicial
-- =====================================================================
-- Convenções:
--   - Identificadores em UUID (gen_random_uuid() vem da pgcrypto)
--   - Enums como VARCHAR + CHECK
--   - Timestamps TIMESTAMPTZ com default now()
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------- users ----------
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(120) NOT NULL,
    email           VARCHAR(160) NOT NULL UNIQUE,
    password_hash   VARCHAR(120) NOT NULL,
    phone           VARCHAR(20),
    status          VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_users_status CHECK (
        status IN ('ACTIVE','BLOCKED','PENDING_VERIFICATION','DELETED')
    )
);

CREATE INDEX idx_users_status ON users (status);

-- ---------- user_roles ----------
CREATE TABLE user_roles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role        VARCHAR(20) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_user_roles_role CHECK (role IN ('CUSTOMER','SELLER','ADMIN','SUPPORT')),
    CONSTRAINT uq_user_roles_user_role UNIQUE (user_id, role)
);

-- ---------- addresses ----------
CREATE TABLE addresses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label           VARCHAR(60) NOT NULL,
    recipient       VARCHAR(120) NOT NULL,
    street          VARCHAR(200) NOT NULL,
    number          VARCHAR(20) NOT NULL,
    complement      VARCHAR(120),
    neighborhood    VARCHAR(120) NOT NULL,
    city            VARCHAR(120) NOT NULL,
    state           CHAR(2) NOT NULL,
    postal_code     VARCHAR(20) NOT NULL,
    is_default      BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_addresses_user_id ON addresses (user_id);

-- ---------- seller_profiles ----------
CREATE TABLE seller_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    store_name      VARCHAR(160) NOT NULL,
    description     TEXT,
    type            VARCHAR(20) NOT NULL,
    rating          NUMERIC(3,2) NOT NULL DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING_REVIEW',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_seller_type CHECK (type IN ('INDIVIDUAL','BOOKSTORE','SEBO')),
    CONSTRAINT chk_seller_status CHECK (status IN ('ACTIVE','SUSPENDED','PENDING_REVIEW'))
);

-- ---------- categories ----------
CREATE TABLE categories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(120) NOT NULL UNIQUE,
    description     TEXT,
    icon            VARCHAR(60),
    active          BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- books ----------
CREATE TABLE books (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(255) NOT NULL,
    author              VARCHAR(255) NOT NULL,
    publisher           VARCHAR(255),
    isbn                VARCHAR(20),
    publication_year    INT,
    description         TEXT,
    category_id         UUID NOT NULL REFERENCES categories(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_books_isbn ON books (isbn);
CREATE INDEX idx_books_category_id ON books (category_id);

-- ---------- book_listings ----------
CREATE TABLE book_listings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id         UUID NOT NULL REFERENCES books(id),
    seller_id       UUID NOT NULL REFERENCES seller_profiles(id),
    price           NUMERIC(12,2) NOT NULL,
    original_price  NUMERIC(12,2),
    stock_quantity  INT NOT NULL DEFAULT 0,
    condition       VARCHAR(20) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING_REVIEW',
    cover_image_url VARCHAR(500),
    description     TEXT NOT NULL,
    city            VARCHAR(120),
    state           CHAR(2),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_listing_price_positive CHECK (price > 0),
    CONSTRAINT chk_listing_stock_nonneg CHECK (stock_quantity >= 0),
    CONSTRAINT chk_listing_condition CHECK (
        condition IN ('NEW','LIKE_NEW','GOOD','FAIR','DAMAGED')
    ),
    CONSTRAINT chk_listing_status CHECK (
        status IN ('PENDING_REVIEW','ACTIVE','PAUSED','BLOCKED','SOLD_OUT','REMOVED')
    )
);

CREATE INDEX idx_listings_seller_id ON book_listings (seller_id);
CREATE INDEX idx_listings_book_id ON book_listings (book_id);
CREATE INDEX idx_listings_status ON book_listings (status);
CREATE INDEX idx_listings_status_city ON book_listings (status, city);

-- ---------- favorites ----------
CREATE TABLE favorites (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id  UUID NOT NULL REFERENCES book_listings(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_favorites_user_listing UNIQUE (user_id, listing_id)
);

-- ---------- carts ----------
CREATE TABLE carts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- cart_items ----------
CREATE TABLE cart_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id     UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    listing_id  UUID NOT NULL REFERENCES book_listings(id),
    quantity    INT NOT NULL,
    unit_price  NUMERIC(12,2) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_cart_item_qty CHECK (quantity > 0),
    CONSTRAINT uq_cart_item_listing UNIQUE (cart_id, listing_id)
);

-- ---------- orders ----------
CREATE TABLE orders (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code                    VARCHAR(20) NOT NULL UNIQUE,
    buyer_id                UUID NOT NULL REFERENCES users(id),
    status                  VARCHAR(30) NOT NULL DEFAULT 'CREATED',
    payment_status          VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    subtotal_amount         NUMERIC(12,2) NOT NULL,
    shipping_amount         NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_amount            NUMERIC(12,2) NOT NULL,
    shipping_address_id     UUID REFERENCES addresses(id),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_order_status CHECK (
        status IN ('CREATED','WAITING_PAYMENT','CONFIRMED','IN_PREPARATION','SHIPPED','DELIVERED','CANCELLED','REFUNDED')
    ),
    CONSTRAINT chk_order_payment_status CHECK (
        payment_status IN ('SIMULATED','PENDING','APPROVED','REJECTED','REFUNDED','CANCELLED')
    )
);

CREATE INDEX idx_orders_buyer_id ON orders (buyer_id);
CREATE INDEX idx_orders_status ON orders (status);

-- ---------- order_items ----------
CREATE TABLE order_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    listing_id  UUID NOT NULL REFERENCES book_listings(id),
    seller_id   UUID NOT NULL REFERENCES seller_profiles(id),
    quantity    INT NOT NULL,
    unit_price  NUMERIC(12,2) NOT NULL,
    subtotal    NUMERIC(12,2) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_order_item_qty CHECK (quantity > 0)
);

CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_order_items_seller_id ON order_items (seller_id);

-- ---------- reviews ----------
CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES orders(id),
    reviewer_id     UUID NOT NULL REFERENCES users(id),
    seller_id       UUID NOT NULL REFERENCES seller_profiles(id),
    rating          INT NOT NULL,
    comment         TEXT,
    tags            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT uq_review_order_seller UNIQUE (order_id, seller_id)
);

CREATE INDEX idx_reviews_seller_id ON reviews (seller_id);

-- ---------- audit_logs ----------
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id   UUID REFERENCES users(id),
    action          VARCHAR(60) NOT NULL,
    resource_type   VARCHAR(40) NOT NULL,
    resource_id     UUID,
    metadata        JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_resource ON audit_logs (resource_type, resource_id);
CREATE INDEX idx_audit_logs_actor ON audit_logs (actor_user_id);
